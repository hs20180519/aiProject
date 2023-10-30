import getPaginationParams from "../utils/getPaginationParams";
import { plainToInstance } from "class-transformer";
import { WordDto } from "../dtos/wordDto";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const getAllWords = async (
  userId: number,
  page: number,
  limit: number,
): Promise<{ words: WordDto[]; totalPages: number; currentPage: number }> => {
  const totalWordCount: number = 3493;
  const totalPages: number = Math.ceil(totalWordCount / (limit ?? 10));
  const offset: { take: number; skip: number } = getPaginationParams(page, limit);

  const wordsWithFavorites = await prisma.word.findMany({
    where: {
      category: {
        not: {
          in: ["custom"],
        },
      },
    },
    select: {
      id: true,
      word: true,
      meaning: true,
      category: true,
      favorite: {
        where: { userId: userId },
      },
    },
    orderBy: { word: "asc" },
    ...offset,
  });

  const words: WordDto[] = wordsWithFavorites.map((wordWithFavorite) => {
    const isFavorite: boolean = wordWithFavorite.favorite.length > 0;
    return {
      id: wordWithFavorite.id,
      word: wordWithFavorite.word,
      meaning: wordWithFavorite.meaning,
      category: wordWithFavorite.category,
      isFavorite,
    };
  });

  return {
    words: plainToInstance(WordDto, words),
    totalPages,
    currentPage: page,
  };
};

export const searchWords = async (
  userId: number,
  searchTerm: string,
  page: number,
  limit: number,
) => {
  const totalWordCount = 3493;
  const totalPages = Math.ceil(totalWordCount / (limit ?? 10));
  const offset = (page - 1) * limit;

  const words = await prisma.word.findMany({
    take: limit,
    skip: offset,
    where: {
      AND: [{ word: { contains: searchTerm } }, { category: { not: "custom" } }],
    },
    orderBy: {
      word: "desc",
    },
    include: {
      favorite: {
        where: { userId: userId },
        select: { userId: true },
      },
    },
  });

  const sortedWords = [...words].sort((a, b) => {
    if (a.word === searchTerm) return -1;
    if (b.word === searchTerm) return 1;
    return 0;
  });

  const mappedWords = sortedWords.map((word) => ({
    id: word.id,
    word: word.word,
    meaning: word.meaning,
    category: word.category,
    isFavorite: word.favorite.length > 0,
  }));

  return {
    words: mappedWords,
    totalPages,
    currentPage: page,
  };
};
