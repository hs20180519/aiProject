import path from "path";
import { Request, Response, NextFunction } from "express";
import { User } from "@prisma/client";
import * as uploadService from "../services/uploadService";

export const uploadProfileImage = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    /**
     * #swagger.tags = ['Upload']
     * #swagger.summary = '프로필 이미지 업로드'
     * #swagger.description = '프로필 이미지 업로드 후 업로드된 이미지 경로 반환. 실제 이미지는 public/images에 저장'
     */
    try {
        const userId = (req.user as User).id;
        const imageUrl = path.join(
            "images",
            (req.file as Express.Multer.File).filename,
        );
        const uploadImageUrl = await uploadService.uploadProfileImage(
            userId,
            imageUrl,
        );
        res.status(201).json(uploadImageUrl);
    } catch (error) {
        console.error(error);
        return next(error);
    }
};
