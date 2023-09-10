import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createPost = async (
    userId: number,
    title: string,
    content: string,
) => {
    try {
        const postData = {
            author: { connect: { id: userId } },
            title,
            content,
        };
        return await prisma.post.create({
            data: postData,
        });
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const getPostByPostId = async (postId: number) => {
    try {
        return await prisma.post.findUnique({
            where: { id: postId },
            include: {
                comment: true,
            },
        });
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const getPostsByUserId = async (
    userId: number,
    page?: number,
    limit?: number,
) => {
    try {
        const totalPostsCount = await prisma.post.count({
            where: { authorId: userId },
        });
        const totalPages = Math.ceil(totalPostsCount / (limit || 10));
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
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const getAllPosts = async (page?: number, limit?: number) => {
    try {
        const totalPostsCount = await prisma.post.count();
        const totalPages = Math.ceil(totalPostsCount / (limit || 10));
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
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const updatePostViewCount = async (postId: number) => {
    try {
        return await prisma.post.update({
            where: { id: postId },
            data: { viewCount: { increment: 1 } },
            include: { comment: true },
        });
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const updatePost = async (
    postId: number,
    title: string,
    content: string,
) => {
    try {
        return await prisma.post.update({
            where: { id: postId },
            data: { title, content },
        });
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const deletePostAndComments = async (postId: number) => {
    await prisma.comment.deleteMany({
        where: { postId: postId },
    });
    await prisma.post.delete({
        where: { id: postId },
    });
};
