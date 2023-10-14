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
): Promise<{ words: WordDto[]; totalPages: number; currentPage: number }> => {
  if (customBookId) {
    const customBook = await prisma.customBook.findUnique({
      where: { id: customBookId, userId: userId },
      include: { word: true },
    });
    const totalWordCount: number = customBook!.word.length;
    const totalPages: number = Math.ceil(totalWordCount / (limit ?? 10));
    const offset: { take: number; skip: number } = getPaginationParams(page, limit);

    customBook!.word.sort((a, b) => a.word.localeCompare(b.word));
    const words = customBook!.word.slice(offset.skip, offset.skip + offset.take);

    return { words: plainToInstance(WordDto, words), totalPages, currentPage: page };
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

    return { words: plainToInstance(WordDto, words), totalPages, currentPage: page };
  }
};

export const getAllWords = async (
  page: number,
  limit: number,
): Promise<{ words: WordDto[]; totalPages: number; currentPage: number }> => {
  const totalWordCount: number = await prisma.word.count({});
  const totalPages: number = Math.ceil(totalWordCount / (limit ?? 10));
  const offset: { take: number; skip: number } = getPaginationParams(page, limit);

  const words = await prisma.word.findMany({
    orderBy: { word: "asc" },
    ...offset,
  });

  return { words: plainToInstance(WordDto, words), totalPages, currentPage: page };
};

export const updateCustomBook = async (
  userId: number,
  customBookId: number,
  updatedData: Partial<BookDto>,
): Promise<BookDto> => {
  const updatedCustomBook = await prisma.customBook.update({
    where: { id: customBookId, userId: userId },
    data: updatedData,
  });
  return plainToInstance(BookDto, updatedCustomBook);
};

export const deleteCustomBook = async (userId: number, customBookId: number): Promise<void> => {
  await prisma.customBook.delete({
    where: { id: customBookId, userId: userId },
  });
  return;
};

export const createCustomBookInWord = async (
  customBookId: number,
  word: string,
  meaning: string,
): Promise<WordDto> => {
  const createdWord = await prisma.word.create({
    data: {
      customBookId: customBookId,
      word: word,
      meaning: meaning,
      category: "custom",
    },
  });
  return plainToInstance(WordDto, createdWord);
};

export const updateCustomBookInWord = async (
  customBookId: number,
  wordId: number,
  updatedData: Partial<WordDto>,
): Promise<WordDto> => {
  const updatedWord = await prisma.word.update({
    where: { id: wordId, customBookId: customBookId },
    data: updatedData,
  });
  return plainToInstance(WordDto, updatedWord);
};

export const deleteCustomBookInWord = async (
  customBookId: number,
  wordId: number,
): Promise<void> => {
  await prisma.word.delete({
    where: { id: wordId, customBookId: customBookId },
  });
  return;
};
