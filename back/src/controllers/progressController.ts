import { Request, Response, NextFunction } from "express";
import { User } from "@prisma/client";
import * as progressService from "../services/progressService";
import { ProgressDto } from "../dtos/progressDto";

export const getProgress = async (req: Request, res: Response, next: NextFunction) => {
  /**
   * #swagger.tags = ['Progress']
   * #swagger.summary = '학습진행률 조회'
   * #swagger.description = '로그인한 사용자의 전체, 카테고리별 학습진행률 조회'
   * #swagger.security = [{
   *   "bearerAuth": []
   * }]
   */
  try {
    const userId: number = (req.user as User).id;
    const progress: ProgressDto = await progressService.getProgress(userId);
    if (!progress) return res.status(204);
    return res.status(200).json(progress);
  } catch (error) {
    console.error(error);
    return next(error);
  }
};
