import { Request, Response, NextFunction } from "express";
import * as studyService from "../services/studyService";
import { User } from "@prisma/client";

export const getWords = async (req: Request, res: Response, next: NextFunction) => {
  /**
   * #swagger.tags = ['Study']
   * #swagger.summary = '단어 학습'
   * #swagger.description = '쿼리별 단어 학습. 틀린 단어, 학습한(맞춘) 단어, 개인 단어장 단어, 수능 토익 토플 IELTS 등. 쿼리가 없다면 전체 데이터셋 중 학습한적 없는 단어. 원하는 항목을 쿼리?key=true'
   * #swagger.security = [{
   *   "bearerAuth": []
   * }]
   */
  try {
    const userId = (req.user as User).id;
    const customBookId = Number(req.query.customId);

    const queryServiceMap = {
      correct: () => studyService.getWordsByUserId(userId, true),
      incorrect: () => studyService.getWordsByUserId(userId, false),
      csat: () => studyService.getWordsByCategory(userId, "csat"),
      toeic: () => studyService.getWordsByCategory(userId, "toeic"),
      toefl: () => studyService.getWordsByCategory(userId, "toefl"),
      ielts: () => studyService.getWordsByCategory(userId, "ielts"),
      custom: () => studyService.getWordsByCategory(userId, "custom", customBookId),
    };

    let words;

    for (const [queryParamKey, serviceFunc] of Object.entries(queryServiceMap)) {
      if (req.query[queryParamKey] === "true") {
        words = await serviceFunc();
        break;
      }
    }

    if (!words) words = await studyService.getWord(userId);

    return res.status(200).json(words);
  } catch (error) {
    console.error(error);
    return next(error);
  }
};

export const saveLearn = async (req: Request, res: Response, next: NextFunction) => {
  /**
   * #swagger.tags = ['Study']
   * #swagger.summary = '학습 중간 저장'
   * #swagger.description = '학습 단어 정답 유무 및 점수 저장, 학습 사이클(총 10개)에서 단어마다 1번씩 호출'
   * #swagger.security = [{
   *   "bearerAuth": []
   * }]
   */
  try {
    const userId: number = (req.user as User).id;
    const { wordId, correct } = req.body;

    if (correct === true) await studyService.updateScore(userId);

    await studyService.saveLearn(userId, wordId, correct);
    return res.status(201).json({ message: "저장되었습니다." });
  } catch (error) {
    console.error(error);
    return next(error);
  }
};

export const getLearnResult = async (req: Request, res: Response, next: NextFunction) => {
  /**
   * #swagger.tags = ['Study']
   * #swagger.summary = '학습 종료 결과'
   * #swagger.description = '학습 종료시 학습 단어 결과 반환'
   * #swagger.security = [{
   *   "bearerAuth": []
   * }]
   */
  try {
    const userId: number = (req.user as User).id;
    const result = await studyService.getLearnResult(userId);
    return res.status(200).json(result);
  } catch (error) {
    console.error(error);
    next(error);
  }
};
