import { Request, Response, NextFunction } from "express";
import * as levelService from "../services/levelService";

export const getTestWords = async (req: Request, res: Response, next: NextFunction) => {
  /**
   * #swagger.tags = ['Level']
   * #swagger.summary = '레벨 테스트 단어'
   * #swagger.description = '[0레벨]3개, [1레벨]4개, [2레벨]3개'
   */
  try {
    const words = await levelService.getTestWords();
    return res.status(200).json(words);
  } catch (error) {
    console.error(error);
    return next(error);
  }
};
