import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createComment = async (
    userId: number,
    postId: number,
    parentId: number | undefined,
    content: string,
) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { nickname: true },
        });
        if (!user) throw new Error("존재하지 않는 유저입니다.");
        const comment = await prisma.comment.create({
            data: {
                content,
                authorId: userId,
                postId: postId,
                parentId: parentId,
            },
        });
        return { ...comment, nickname: user.nickname };
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const getCommentByCommentId = async (commentId: number) => {
    try {
        return prisma.comment.findUnique({ where: { id: commentId } });
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const updateComment = async (commentId: number, content: string) => {
    try {
        return prisma.comment.update({
            where: { id: commentId },
            data: { content },
        });
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const deleteCommentAndChildren = async (commentId: number) => {
    try {
        const childComments = await prisma.comment.findMany({
            where: { parentId: commentId },
        });
        for (const childComment of childComments) {
            await deleteCommentAndChildren(childComment.id);
        }
        await prisma.comment.delete({
            where: { id: commentId },
        });
    } catch (error) {
        console.error(error);
        throw error;
    }
};
