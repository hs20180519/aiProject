import { Request, Response, NextFunction } from "express";
import { User } from "@prisma/client";
import * as bookService from "../services/bookService";
import { BookDto, BooksDto } from "../dtos/bookDto";

export const createBook = async (req: Request, res: Response, next: NextFunction) => {
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
export const getBooks = async (req: Request, res: Response, next: NextFunction) => {
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
