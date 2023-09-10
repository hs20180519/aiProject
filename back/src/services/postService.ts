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
    } catch (error) {
        console.error(error);
        throw error;
    }
};
