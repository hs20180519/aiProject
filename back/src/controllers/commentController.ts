import { Request, Response, NextFunction } from "express";
import * as commentService from "../services/commentService";
import { User } from "@prisma/client";

export const createComment = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    /**
     * #swagger.tags = ['Comment']
     * #swagger.summary = '댓글 작성'
     */
    try {
        const userId = (req.user as User).id;
        const postId = Number(req.query.postId);
        const parentId = Number(req.query.parentId);
        const content = req.body.content;

        const newComment = await commentService.createComment(
            userId,
            postId,
            parentId,
            content,
        );
        return res.status(201).json(newComment);
    } catch (error) {
        console.error(error);
        return next(error);
    }
};

export const updateComment = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    /**
     * #swagger.tags = ['Comment']
     * #swagger.summary = '댓글 수정'
     * #swagger.description = '댓글 작성자 또는 관리자만 수정 가능'
     */
    try {
        const user = req.user as User;
        const commentId = Number(req.params.commentId);
        const { content } = req.body;
        const comment = await commentService.getCommentByCommentId(commentId);
        if (!comment)
            return res
                .status(404)
                .json({ message: "댓글이 존재하지 않습니다." });
        if (comment.authorId !== user.id && !user.manager)
            return res.status(403).json({ message: "수정 권한이 없습니다." });
        const updatedComment = await commentService.updateComment(
            commentId,
            content,
        );
        return res.status(200).json(updatedComment);
    } catch (error) {
        console.error(error);
        return next(error);
    }
};

export const deleteComment = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    /**
     * #swagger.tags = ['Comment']
     * #swagger.summary = '댓글 삭제'
     * #swagger.description = '댓글 작성자 또는 관리자만 삭제 가능'
     */
    try {
        const user = req.user as User;
        const commentId = Number(req.params.commentId);
        const comment = await commentService.getCommentByCommentId(commentId);
        if (!comment)
            return res
                .status(404)
                .json({ message: "댓글이 존재하지 않습니다." });
        if (comment.authorId !== user.id && !user.manager)
            return res.status(403).json({ message: "삭제 권한이 없습니다." });
        const deletedComments =
            await commentService.deleteCommentAndChildren(commentId);
        return res
            .status(200)
            .json({ message: `${deletedComments}번 댓글이 삭제되었습니다.` });
    } catch (error) {
        console.error(error);
        return next(error);
    }
};
