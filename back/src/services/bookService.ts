import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import { BookDto, BooksDto } from "../dtos/bookDto";
import { plainToInstance } from "class-transformer";
import getPaginationParams from "../utils/getPaginationParams";
import { WordDto, WordProgressDto } from "../dtos/wordDto";

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
  return plainToInstance(BooksDto, books);
};

export const getWordByUserId = async (
  page: number,
  limit: number,
  userId: number,
  correct: boolean,
): Promise<{ words: WordProgressDto[]; totalPages: number }> => {
  const totalWordCount: number = await prisma.wordProgress.count({
    where: { userId: userId, correct: correct },
  });
  const totalPages: number = Math.ceil(totalWordCount / (limit ?? 10));
  const offset: { take: number; skip: number } = getPaginationParams(page, limit);

  const words = await prisma.wordProgress.findMany({
    where: { userId: userId, correct: correct },
    orderBy: { word: { word: "asc" } },
    include: { word: true },
    ...offset,
  });

  return { words: plainToInstance(WordProgressDto, words), totalPages };
};

export const getWordByCategory = async (
  page: number,
  limit: number,
  userId: number,
  category: string,
  customBookId?: number,
): Promise<{ words: WordDto[]; totalPages: number }> => {
  if (customBookId) {
    const customBook = await prisma.customBook.findUnique({
      where: { id: customBookId, userId: userId },
      include: { Word: true },
    });
    const totalWordCount: number = customBook!.Word.length;
    const totalPages: number = Math.ceil(totalWordCount / (limit ?? 10));
    const offset: { take: number; skip: number } = getPaginationParams(page, limit);

    customBook!.Word.sort((a, b) => a.word.localeCompare(b.word));
    const words = customBook!.Word.slice(offset.skip, offset.skip + offset.take);

    return { words: plainToInstance(WordDto, words), totalPages };
  } else {
    const totalWordCount: number = await prisma.word.count({
      where: { category: category },
    });
    const totalPages: number = Math.ceil(totalWordCount / (limit ?? 10));
    const offset: { take: number; skip: number } = getPaginationParams(page, limit);

    const words = await prisma.word.findMany({
      where: { category: category },
      orderBy: { word: "asc" },
      ...offset,
    });

    return { words: plainToInstance(WordDto, words), totalPages };
  }
};

export const getAllWords = async (
  page: number,
  limit: number,
): Promise<{ words: WordDto[]; totalPages: number }> => {
  const totalWordCount: number = await prisma.word.count({});
  const totalPages: number = Math.ceil(totalWordCount / (limit ?? 10));
  const offset: { take: number; skip: number } = getPaginationParams(page, limit);

  const words = await prisma.word.findMany({
    orderBy: { word: "asc" },
    ...offset,
  });

  return { words: plainToInstance(WordDto, words), totalPages };
};
