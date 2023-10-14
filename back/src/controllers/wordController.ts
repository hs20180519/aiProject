import { Request, Response, NextFunction } from "express";
import * as wordService from "../services/wordService";
import { User } from "@prisma/client";

export const getWords = async (req: Request, res: Response, next: NextFunction) => {
  /**
   * #swagger.tags = ['Word']
   * #swagger.summary = '단어 학습'
   * #swagger.description = '쿼리별 단어 학습. 틀린 단어, 학습한 단어, 개인 단어장 단어, 쿼리가 없다면 전체 데이터셋 중 학습한적 없는 단어'
   * #swagger.security = [{
   *   "bearerAuth": []
   * }]
   */
  try {
    const userId = (req.user as User).id;
    const customBookId = Number(req.query.customBookId);
    const isWrongAnswerBook = req.query.isWrongAnswerBook === "true";
    const isStudiedBook = req.query.isStudiedBook === "true";

    let words;

    if (isStudiedBook) {
      words = await wordService.getWordsByUserId(userId, null);
    } else if (isWrongAnswerBook) {
      words = await wordService.getWordsByUserId(userId, false);
    } else if (customBookId) {
      words = await wordService.getWordsByCustomBookId(customBookId);
    } else {
      words = await wordService.getWord(userId);
    }

    return res.status(200).json(words);
  } catch (error) {
    console.error(error);
    return next(error);
  }
};
