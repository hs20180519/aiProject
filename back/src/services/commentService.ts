import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createComment = async (
    userId: number,
    postId: number,
    parentId: number | undefined,
    content: string,
) => {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { nickname: true },
    });
    const comment = await prisma.comment.create({
        data: {
            content,
            authorId: userId,
            postId: postId,
            parentId: parentId,
        },
    });
    return { ...comment, nickname: user!.nickname };
};

export const getCommentByCommentId = async (commentId: number) => {
    return prisma.comment.findUnique({ where: { id: commentId } });
};

export const updateComment = async (commentId: number, content: string) => {
    return prisma.comment.update({
        where: { id: commentId },
        data: { content },
    });
};

export const deleteCommentAndChildren = async (commentId: number) => {
    const childComments = await prisma.comment.findMany({
        where: { parentId: commentId },
    });
    for (const childComment of childComments) {
        await deleteCommentAndChildren(childComment.id);
    }
    await prisma.comment.delete({
        where: { id: commentId },
    });
};
