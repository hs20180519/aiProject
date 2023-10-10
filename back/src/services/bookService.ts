import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import { BookDto, BooksDto } from "../dtos/bookDto";
import { plainToInstance } from "class-transformer";

export const createBook = async (userId: number, title: string): Promise<BookDto> => {
  const createdBook = prisma.customBook.create({
    data: {
      userId: userId,
      title: title,
    },
  });
  return plainToInstance(BookDto, createdBook);
};
export const getBooks = async (userId: number): Promise<BooksDto[]> => {
  const books = await prisma.customBook.findMany({
    where: { userId: userId },
    select: {
      id: true,
      title: true,
    },
  });
  // return books.map((book: object) => plainToInstance(BooksDto, book));
  return plainToInstance(BooksDto, books);
};
