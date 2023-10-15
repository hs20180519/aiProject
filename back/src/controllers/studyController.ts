import { Request, Response, NextFunction } from "express";
import * as studyService from "../services/studyService";
import { User } from "@prisma/client";
import { WordProgressDto, WordWithChoicesDto } from "../dtos/wordDto";

export const experience = async (req: Request, res: Response, next: NextFunction) => {
  /**
   * #swagger.tags = ['Study']
   * #swagger.summary = '학습 체험'
   * #swagger.description = '비회원 학습 체험으로 한번에 10개의 단어와 사지선다 제공 (클라에서 관리하고 결과 반환해주셔야함)'
   */
  try {
    const words: WordWithChoicesDto[] = await studyService.getExperienceWord();
    return res.status(200).json(words);
  } catch (error) {
    console.error(error);
    return next(error);
  }
};

export const getWords = async (req: Request, res: Response, next: NextFunction) => {
  /**
   * #swagger.tags = ['Study']
   * #swagger.summary = '단어 학습'
   * #swagger.description = '쿼리별 단어 학습 / ?key=true / 커스텀단어 학습만 ?custom=true?customBookId=id'
   * #swagger.security = [{
   *   "bearerAuth": []
   * }]
   * * #swagger.parameters['correct'] = {  type: 'boolean' }
   *  * #swagger.parameters['incorrect'] = {  type: 'boolean' }
   *  * #swagger.parameters['csat'] = {  type: 'boolean' }
   *  * #swagger.parameters['toeic'] = {  type: 'boolean' }
   *  * #swagger.parameters['toefl'] = { type: 'boolean' }
   *  * #swagger.parameters['ielts'] = {  type: 'boolean' }
   *  * #swagger.parameters['custom'] = {  type: 'boolean' }
   */
  try {
    const userId: number = (req.user as User).id;
    const customBookId: number = Number(req.query.customBookId);

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
    const result: WordProgressDto[] = await studyService.getLearnResult(userId);
    return res.status(200).json(result);
  } catch (error) {
    console.error(error);
    next(error);
  }
};
