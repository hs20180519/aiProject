import { Request, Response, NextFunction } from "express";
import { User } from "@prisma/client";
import * as bookService from "../services/bookService";
import { BooksDto } from "../dtos/bookDto";

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
