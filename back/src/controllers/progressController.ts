import { Request, Response, NextFunction } from "express";
import { User } from "@prisma/client";
import * as progressService from "../services/progressService";

export const getProgress = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId: number = (req.user as User).id;
    const progress = await progressService.getProgress(userId);
    if (!progress) return res.status(204);
    return res.status(200).json(progress);
  } catch (error) {
    console.error(error);
    return next(error);
  }
};
