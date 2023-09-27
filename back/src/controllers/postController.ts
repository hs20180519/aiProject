import { Request, Response, NextFunction } from "express";
import { User } from "@prisma/client";
import * as postService from "../services/postService";

export const createPost = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    /**
     * #swagger.tags = ['Post']
     * #swagger.summary = '게시글 작성'
     * #swagger.description = '게시글 작성 후 게시글 반환'
     */
    try {
        const userId = (req.user as User).id;
        const { title, content } = req.body;
        const post = await postService.createPost(userId, title, content);
        return res.status(201).json(post);
    } catch (error) {
        console.error(error);
        return next(error);
    }
};

export const getPosts = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    /**
     * #swagger.tags = ['Post']
     * #swagger.summary = '게시글 조회'
     * #swagger.description = '요청 쿼리에 따라 게시글 조회. postId가 있으면 해당 게시글 조회, userId가 있으면 해당 유저의 게시글 조회, 둘 다 없으면 모든 게시글 조회'
     */
    try {
        const postId = Number(req.query.postId);
        const userId = Number(req.query.userId);
        const page = Number(req.query.page);
        const limit = Number(req.query.limit);
        if (postId) {
            const post = await postService.getPostByPostId(postId);
            if (!post)
                return res
                    .status(404)
                    .json({ message: "존재하지 않는 게시글입니다." });
            const updatedViewCountPost =
                await postService.updatePostViewCount(postId);
            return res.status(200).json(updatedViewCountPost);
        } else if (userId) {
            const posts = await postService.getPostsByUserId(
                userId,
                page,
                limit,
            );
            return res.status(200).json(posts);
        } else {
            const posts = await postService.getAllPosts(page, limit);
            return res.status(200).json(posts);
        }
    } catch (error) {
        console.error(error);
        return next(error);
    }
};

export const updatePost = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    /**
     * #swagger.tags = ['Post']
     * #swagger.summary = '게시글 수정'
     * #swagger.description = '게시글 작성자 또는 관리자만 수정 가능'
     */
    try {
        const user = req.user as User;
        const postId = Number(req.params.postId);
        const { title, content } = req.body;
        const post = await postService.getPostByPostId(postId);
        if (!post)
            return res
                .status(404)
                .json({ message: "존재하지 않는 게시글입니다." });
        if (post.authorId !== user.id && !user.manager)
            return res.status(403).json({ message: "권한이 없습니다." });
        const updatedPost = await postService.updatePost(
            postId,
            title,
            content,
        );
        return res.status(200).json(updatedPost);
    } catch (error) {
        console.error(error);
        return next(error);
    }
};

export const deletePost = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    /**
     * #swagger.tags = ['Post']
     * #swagger.summary = '게시글 삭제'
     * #swagger.description = '게시글 작성자 또는 관리자만 삭제 가능. 게시글 삭제 시 해당 게시글의 댓글도 함께 삭제'
     */
    try {
        const postId = Number(req.params.postId);
        const post = await postService.getPostByPostId(postId);
        if (!post)
            return res
                .status(404)
                .json({ message: "존재하지 않는 게시글입니다." });
        if (
            post.authorId !== (req.user as User).id &&
            !(req.user as User).manager
        )
            return res.status(403).json({ message: "권한이 없습니다." });
        await postService.deletePostAndComments(postId);
        return res.status(204).json({ message: "게시글이 삭제되었습니다." });
    } catch (error) {
        console.error(error);
        return next(error);
    }
};
