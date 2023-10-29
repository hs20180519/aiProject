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
  const totalWordCount: number = await prisma.word.count({});
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
