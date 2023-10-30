import { CustomBook, Favorite, PrismaClient, Word } from "@prisma/client";
import { BookDto, BooksDto } from "../dtos/bookDto";
import { plainToInstance } from "class-transformer";
import getPaginationParams from "../utils/getPaginationParams";
import { WordDto, WordProgressDto } from "../dtos/wordDto";

const prisma = new PrismaClient();

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
  const books: BooksDto[] = await prisma.customBook.findMany({
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
): Promise<{ words: WordProgressDto[]; totalPages: number; currentPage: number }> => {
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

  return { words: plainToInstance(WordProgressDto, words), totalPages, currentPage: page };
};

export const getWordByCategory = async (
  page: number,
  limit: number,
  userId: number,
  category: string,
  customBookId?: string | undefined,
): Promise<{ words: WordDto[]; totalPages: number; currentPage: number }> => {
  if (customBookId) {
    const bookId: number = Number(customBookId);
    const customBook = await prisma.customBook.findUnique({
      where: { id: bookId },
      include: { word: true },
    });

    const totalWordCount: number = customBook!.word.length;
    const totalPages: number = Math.ceil(totalWordCount / (limit ?? 10));
    const offset: { take: number; skip: number } = getPaginationParams(page, limit);

    customBook!.word.sort((a, b) => a.word.localeCompare(b.word));
    const words: Word[] = customBook!.word.slice(offset.skip, offset.skip + offset.take);

    return { words: plainToInstance(WordDto, words), totalPages, currentPage: page };
  } else {
    const totalWordCount: number = await prisma.word.count({
      where: { category: category },
    });

    const totalPages: number = Math.ceil(totalWordCount / (limit ?? 10));
    const offset: { take: number; skip: number } = getPaginationParams(page, limit);

    const words: Word[] = await prisma.word.findMany({
      where: { category: category },
      orderBy: { word: "asc" },
      ...offset,
    });

    return { words: plainToInstance(WordDto, words), totalPages, currentPage: page };
  }
};
export const getWordByFavorite = async (
  page: number,
  limit: number,
  userId: number,
): Promise<{ words: WordDto[]; totalPages: number; currentPage: number }> => {
  const totalWordCount: number = await prisma.favorite.count({ where: { userId: userId } });
  const totalPages: number = Math.ceil(totalWordCount / (limit ?? 10));
  const offset: { take: number; skip: number } = getPaginationParams(page, limit);

  const favoriteWord: (Favorite & { word: Word })[] = await prisma.favorite.findMany({
    where: {
      userId: userId,
    },
    include: {
      word: true,
    },
    ...offset,
  });

  const words: Word[] = favoriteWord.map((item) => item.word);
  words.sort((a: Word, b: Word) => a.word.localeCompare(b.word, "en", { sensitivity: "base" }));

  return { words: plainToInstance(WordDto, words), totalPages, currentPage: page };
};

export const updateCustomBook = async (
  userId: number,
  customBookId: number,
  updatedData: Partial<BookDto>,
): Promise<BookDto> => {
  const existingCustomBook: CustomBook | null = await prisma.customBook.findUnique({
    where: { id: customBookId },
  });

  if (!existingCustomBook) {
    throw new Error("단어장을 찾을 수 없습니다.");
  }

  if (existingCustomBook.userId !== userId) {
    throw new Error("권한이 없습니다.");
  }

  const updatedCustomBook: CustomBook = await prisma.customBook.update({
    where: { id: customBookId },
    data: updatedData,
  });

  return plainToInstance(BookDto, updatedCustomBook);
};

export const deleteCustomBook = async (userId: number, customBookId: number): Promise<void> => {
  const existingCustomBook: CustomBook | null = await prisma.customBook.findUnique({
    where: { id: customBookId },
  });

  if (!existingCustomBook) {
    throw new Error("단어장을 찾을 수 없습니다.");
  }

  if (existingCustomBook.userId !== userId) {
    throw new Error("권한이 없습니다.");
  }

  await prisma.customBook.delete({
    where: { id: customBookId },
  });
  return;
};

export const deleteAllCustomBook = async (userId: number): Promise<void> => {
  await prisma.customBook.deleteMany({
    where: {
      userId: userId,
    },
  });
};

export const createCustomWordInBook = async (
  customBookId: number,
  word: string,
  meaning: string,
): Promise<WordDto> => {
  const createdWord: Word = await prisma.word.create({
    data: {
      customBookId: customBookId,
      word: word,
      meaning: meaning,
      category: "custom",
    },
  });
  return plainToInstance(WordDto, createdWord);
};

export const updateCustomWordInBook = async (
  customBookId: number,
  wordId: number,
  updatedData: Partial<WordDto>,
): Promise<WordDto> => {
  const existingWord: Word | null = await prisma.word.findUnique({
    where: { id: wordId },
  });

  if (!existingWord) {
    throw new Error("단어를 찾을 수 없습니다.");
  }

  if (existingWord.customBookId !== customBookId) {
    throw new Error("해당 단어는 요청하신 단어장에 포함되어 있지 않습니다.");
  }

  const updatedWord: Word = await prisma.word.update({
    where: { id: wordId },
    data: updatedData,
  });

  return plainToInstance(WordDto, updatedWord);
};

export const deleteCustomWordInBook = async (
  customBookId: number,
  wordId: number,
): Promise<void> => {
  const existingWord: Word | null = await prisma.word.findUnique({
    where: { id: wordId },
  });

  if (!existingWord) {
    throw new Error("단어가 존재하지 않습니다.");
  }

  if (existingWord.customBookId !== customBookId) {
    throw new Error("해당 단어는 요청하신 단어장에 포함되어 있지 않습니다.");
  }

  await prisma.word.delete({
    where: { id: wordId },
  });
};

export const getFavoriteWordByWordId = async (userId: number, wordId: number): Promise<WordDto> => {
  const favoriteWord: Favorite | null = await prisma.favorite.findFirst({
    where: {
      userId: userId,
      wordId: wordId,
    },
  });
  return plainToInstance(WordDto, favoriteWord);
};

export const createFavoriteWord = async (userId: number, wordId: number): Promise<WordDto> => {
  const favoriteWord: Favorite = await prisma.favorite.create({
    data: {
      userId: userId,
      wordId: wordId,
    },
  });
  return plainToInstance(WordDto, favoriteWord);
};

export const deleteAllFavoriteWord = async (userId: number) => {
  return prisma.favorite.deleteMany({
    where: { userId },
  });
};

export const deleteFavoriteWord = async (userId: number, wordId: number) => {
  return prisma.favorite.delete({
    where: { userId_wordId: { userId, wordId } },
  });
};
