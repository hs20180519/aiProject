import { Request, Response, NextFunction } from "express";
import * as storageService from "../services/storageService";
import { User } from "@prisma/client";

export const getAllWords = async (req: Request, res: Response, next: NextFunction) => {
  /**
   * #swagger.tags = ['Storage']
   * #swagger.summary = '모든 단어 조회 (커스텀, 즐겨찾기 단어 제외)'
   * #swagger.description = '서버사이드 페이징'
   * #swagger.security = [{
   *   "bearerAuth": []
   * }]
   */
  try {
    const page: number = req.query.page ? Number(req.query.page) : 1;
    const limit: number = req.query.llimit ? Number(req.query.limit) : 10;
    const words = await storageService.getAllWords(page, limit);
    return res.status(200).json(words);
  } catch (error) {
    console.error(error);
    return next(error);
  }
};
