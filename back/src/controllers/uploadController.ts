import path from "path";
import { Request, Response, NextFunction } from "express";
import { User } from "@prisma/client";
import * as uploadService from "../services/uploadService";

export const uploadProfileImage = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
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
        next(error);
    }
};
