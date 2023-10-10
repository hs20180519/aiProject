import { Request, Response, NextFunction } from "express";
import { User } from "@prisma/client";
import * as bookService from "../services/bookService";
import { BookDto, BooksDto } from "../dtos/bookDto";

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
   * #swagger.summary = '커스텀 단어장 단어 조회'
   * #swagger.description = '쿼리별 단어 조회. 서버사이드 페이징'
   * #swagger.security = [{
   *   "bearerAuth": []
   * }]
   */
  try {
    const userId: number = (req.user as User).id;
    const customBookId: number = Number(req.query.customBookId);
    const page = req.query.page ? Number(req.query.page) : 1;
    const limit = req.query.page ? Number(req.query.limit) : 10;

    const queryServiceMap = {
      correct: () => bookService.getWordByUserId(page, limit, userId, true),
      incorrect: () => bookService.getWordByUserId(page, limit, userId, false),
      csat: () => bookService.getWordByCategory(page, limit, userId, "csat"),
      toeic: () => bookService.getWordByCategory(page, limit, userId, "toeic"),
      toefl: () => bookService.getWordByCategory(page, limit, userId, "toefl"),
      ielts: () => bookService.getWordByCategory(page, limit, userId, "ielts"),
      custom: () => bookService.getWordByCategory(page, limit, userId, "custom", customBookId),
    };

    let book;

    for (const [queryParamKey, serviceFunc] of Object.entries(queryServiceMap)) {
      if (req.query[queryParamKey] === "true") {
        book = await serviceFunc();
        break;
      }
    }

    if (!book) book = await bookService.getAllWords(page, limit);

    return res.status(200).json(book);
  } catch (error) {
    console.error(error);
    return next(error);
  }
};
