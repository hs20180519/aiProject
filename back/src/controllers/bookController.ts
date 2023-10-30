import { Request, Response, NextFunction } from "express";
import { User } from "@prisma/client";
import * as bookService from "../services/bookService";
import { BookDto, BooksDto } from "../dtos/bookDto";
import { WordDto } from "../dtos/wordDto";

export const createBook = async (req: Request, res: Response, next: NextFunction) => {
  /**
   * #swagger.tags = ['Book']
   * #swagger.summary = '커스텀 단어장 생성'
   * #swagger.security = [{
   *   "bearerAuth": []
   * }]
   */
  try {
    const userId: number = (req.user as User).id;
    const title: string = req.body.title;
    const createdBook: BookDto = await bookService.createBook(userId, title);
    return res.status(201).json(createdBook);
  } catch (error) {
    console.error(error);
    return next(error);
  }
};
export const getBookList = async (req: Request, res: Response, next: NextFunction) => {
  /**
   * #swagger.tags = ['Book']
   * #swagger.summary = '커스텀 단어장 리스트 조회'
   * #swagger.security = [{
   *   "bearerAuth": []
   * }]
   */
  try {
    const userId: number = (req.user as User).id;
    const books: BooksDto[] = await bookService.getBooks(userId);
    if (!books) return res.status(204);
    return res.status(200).json(books);
  } catch (error) {
    console.error(error);
    return next(error);
  }
};

export const getBook = async (req: Request, res: Response, next: NextFunction) => {
  /**
   * #swagger.tags = ['Book']
   * #swagger.summary = '단어장 단어 조회'
   * #swagger.description = '쿼리별 단어장 조회 (서버사이드 페이징)
   * ?book={correct, incorrect, csat, toeic, toefl, favorite, custom}&customBookId="" '
   * #swagger.security = [{
   *   "bearerAuth": []
   * }]
   */
  try {
    const page: number = req.query.page ? Number(req.query.page) : 1;
    const limit: number = req.query.limit ? Number(req.query.limit) : 10;
    const userId: number = (req.user as User).id;
    const category: string = String(req.query.book);
    const customBookId: string = String(req.query.customBookId);

    const queryServiceMap: {
      [key: string]: (userId: number, customBookId?: string) => Promise<any>;
    } = {
      correct: (userId: number) => bookService.getWordByUserId(page, limit, userId, true),
      incorrect: (userId: number) => bookService.getWordByUserId(page, limit, userId, false),
      csat: (userId: number) => bookService.getWordByCategory(page, limit, userId, "csat"),
      toeic: (userId: number) => bookService.getWordByCategory(page, limit, userId, "toeic"),
      toefl: (userId: number) => bookService.getWordByCategory(page, limit, userId, "toefl"),
      favorite: (userId: number) => bookService.getWordByFavorite(page, limit, userId),
      custom: (userId: number, customBookId: string | undefined) =>
        bookService.getWordByCategory(page, limit, userId, "custom", customBookId),
    };

    if (category && queryServiceMap[category]) {
      const words = await queryServiceMap[category](userId, customBookId);
      return res.status(200).json(words);
    }
  } catch (error) {
    console.error(error);
    return next(error);
  }
};

export const updateCustomBook = async (req: Request, res: Response, next: NextFunction) => {
  /**
   * #swagger.tags = ['Book']
   * #swagger.summary = '커스텀 단어장 업데이트'
   * #swagger.description = '요청받은 필드만 업데이트'
   * #swagger.security = [{
   *   "bearerAuth": []
   * }]
   */
  try {
    const userId: number = (req.user as User).id;
    const customBookId: number = Number(req.query.customBookId);
    const updatedData = req.body;

    const updatedCustomBook: BookDto = await bookService.updateCustomBook(
      userId,
      customBookId,
      updatedData,
    );
    return res.status(200).json(updatedCustomBook);
  } catch (error) {
    console.error(error);
    return next(error);
  }
};

export const deleteCustomBook = async (req: Request, res: Response, next: NextFunction) => {
  /**
   * #swagger.tags = ['Book']
   * #swagger.summary = '커스텀 단어장 삭제'
   * #swagger.description = '포함된 단어 전부 삭제'
   * #swagger.security = [{
   *   "bearerAuth": []
   * }]
   */
  try {
    const userId: number = (req.user as User).id;
    const customBookId: number = Number(req.query.customBookId);

    await bookService.deleteCustomBook(userId, customBookId);

    return res.status(200).json({ message: "단어장이 삭제되었습니다." });
  } catch (error) {
    console.error(error);
    return next(error);
  }
};

export const deleteAllCustomBook = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req.user as User).id;
    await bookService.deleteAllCustomBook(userId);
    return res.status(200).json({ message: "모든 커스텀 단어장이 삭제되었습니다." });
  } catch (error) {
    console.error(error);
    return next(error);
  }
};

export const createCustomWordInBook = async (req: Request, res: Response, next: NextFunction) => {
  /**
   * #swagger.tags = ['Book']
   * #swagger.summary = '커스텀 단어장 단어 추가'
   * #swagger.security = [{
   *   "bearerAuth": []
   * }]
   */
  try {
    const customBookId: number = Number(req.query.customBookId);
    const { word, meaning } = req.body;

    const createdCustomWordInBook: WordDto = await bookService.createCustomWordInBook(
      customBookId,
      word,
      meaning,
    );
    return res.status(201).json(createdCustomWordInBook);
  } catch (error) {
    console.error(error);
    return next(error);
  }
};

export const updateCustomWordInBook = async (req: Request, res: Response, next: NextFunction) => {
  /**
   * #swagger.tags = ['Book']
   * #swagger.summary = '커스텀 단어장 단어 수정'
   * #swagger.description = '요청받은 필드만 업데이트'
   * #swagger.security = [{
   *   "bearerAuth": []
   * }]
   */
  try {
    const customBookId: number = Number(req.query.customBookId);
    const wordId: number = Number(req.query.wordId);
    const updatedData = req.body;

    const updatedWord: WordDto = await bookService.updateCustomWordInBook(
      customBookId,
      wordId,
      updatedData,
    );
    return res.status(200).json(updatedWord);
  } catch (error) {
    console.error(error);
    return next(error);
  }
};

export const deleteCustomWordInBook = async (req: Request, res: Response, next: NextFunction) => {
  /**
   * #swagger.tags = ['Book']
   * #swagger.summary = '커스텀 단어장 단어 삭제'
   * #swagger.security = [{
   *   "bearerAuth": []
   * }]
   */
  try {
    const customBookId: number = Number(req.query.customBookId);
    const wordId: number = Number(req.query.wordId);

    await bookService.deleteCustomWordInBook(customBookId, wordId);

    return res.status(200).json({ message: "단어가 삭제되었습니다." });
  } catch (error) {
    console.error(error);
    return next(error);
  }
};

export const createFavoriteWordInBook = async (req: Request, res: Response, next: NextFunction) => {
  /**
   * #swagger.tags = ['Book']
   * #swagger.summary = '즐겨찾기 추가 ?wordId='
   * #swagger.security = [{
   *   "bearerAuth": []
   * }]
   */
  try {
    const userId: number = (req.user as User).id;
    const wordId: number = Number(req.query.wordId);

    const existingFavorite: WordDto = await bookService.getFavoriteWordByWordId(userId, wordId);
    if (existingFavorite) return res.status(409).json({ message: "이미 추가한 단어입니다." });
    const createdFavoriteWord: WordDto = await bookService.createFavoriteWord(userId, wordId);
    return res.status(201).json(createdFavoriteWord);
  } catch (error) {
    console.error(error);
    return next(error);
  }
};

export const deleteFavoriteWord = async (req: Request, res: Response, next: NextFunction) => {
  /**
   * #swagger.tags = ['Book']
   * #swagger.summary = '즐겨찾기 단어 삭제. ?wordId&all / all="true" 요청 시 유저의 모든 즐겨찾기 단어 삭제'
   * #swagger.security = [{
   *   "bearerAuth": []
   * }]
   */
  try {
    const userId: number = (req.user as User).id;
    const wordId: number = Number(req.query.wordId);
    const all: boolean = Boolean(req.query.all === "true");

    if (all) await bookService.deleteAllFavoriteWord(userId);
    else await bookService.deleteFavoriteWord(userId, wordId);

    return res.status(200).json({ message: "즐겨찾기 단어 삭제 완료" });
  } catch (error) {
    console.error(error);
    return next(error);
  }
};
