import { Request, Response, NextFunction } from "express";
import { User } from "@prisma/client";
import * as postService from "../services/postService";

export const createPost = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const userId = (req.user as User).id;
        const { title, content } = req.body;
        const post = await postService.createPost(userId, title, content);
        return res.status(201).json(post);
    } catch (error) {
        console.error(error);
        next(error);
    }
};

export const getPosts = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const postId = Number(req.query.postId);
        const userId = Number(req.query.userId);
        const page = Number(req.query.page) || undefined;
        const limit = Number(req.query.limit) || undefined;
        if (postId) {
            const post = await postService.getPostByPostId(postId);
            if (!post)
                return res
                    .status(404)
                    .json({ message: "존재하지 않는 게시글입니다." });
            return res.status(200).json(post);
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
        next(error);
    }
};
