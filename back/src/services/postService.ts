import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createPost = async (
    userId: number,
    title: string,
    content: string,
) => {
    const postData = {
        author: { connect: { id: userId } },
        title,
        content,
    };
    return prisma.post.create({
        data: postData,
    });
};

export const getPostByPostId = async (postId: number) => {
    return prisma.post.findUnique({
        where: { id: postId },
        include: {
            comment: true,
        },
    });
};

export const getPostsByUserId = async (
    userId: number,
    page?: number,
    limit?: number,
) => {
    const totalPostsCount = await prisma.post.count({
        where: { authorId: userId },
    });
    const totalPages = Math.ceil(totalPostsCount / (limit ?? 10));
    const offset =
        page !== undefined && limit !== undefined
            ? { skip: (page - 1) * limit, take: limit }
            : {};

    const posts = await prisma.post.findMany({
        where: { authorId: userId },
        include: {
            comment: true,
        },
        ...(offset as object),
    });
    return { posts, currentPage: page, totalPages: totalPages };
};

export const getAllPosts = async (page?: number, limit?: number) => {
    const totalPostsCount = await prisma.post.count();
    const totalPages = Math.ceil(totalPostsCount / (limit ?? 10));
    const offset =
        page !== undefined && limit !== undefined
            ? { skip: (page - 1) * limit, take: limit }
            : {};
    const posts = await prisma.post.findMany({
        include: {
            comment: true,
        },
        ...(offset as object),
    });

    return { posts, currentPage: page, totalPages: totalPages };
};

export const updatePostViewCount = async (postId: number) => {
    return prisma.post.update({
        where: { id: postId },
        data: { viewCount: { increment: 1 } },
        include: { comment: true },
    });
};

export const updatePost = async (
    postId: number,
    title: string,
    content: string,
) => {
    return prisma.post.update({
        where: { id: postId },
        data: { title, content },
    });
};

export const deletePostAndComments = async (postId: number) => {
    await prisma.comment.deleteMany({
        where: { postId: postId },
    });
    await prisma.post.delete({
        where: { id: postId },
    });
};
