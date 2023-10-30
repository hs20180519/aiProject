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
  const totalWordCount: number = 3493;
  const totalPages: number = Math.ceil(totalWordCount / (limit ?? 10));
  const offset: number = (page - 1) * limit;

  console.log(searchTerm);

  const searchWords: WordDto[] = await prisma.$queryRawUnsafe(String.raw`
  SELECT Word.*, IF(Favorite.userId IS NULL, false, true) AS isFavorite
  FROM Word LEFT JOIN Favorite ON Word.id = Favorite.wordId AND Favorite.userId = ${userId}
  WHERE MATCH(word) AGAINST('${searchTerm}') AND category <> 'custom'
  ORDER BY MATCH(word) AGAINST('${searchTerm}') DESC LIMIT ${limit} OFFSET ${offset};
`);

  const words = searchWords.map((word) => {
    const isFavorite: boolean = !!word.isFavorite;
    return {
      id: word.id,
      word: word.word,
      meaning: word.meaning,
      category: word.category,
      isFavorite,
    };
  });

  return {
    words: plainToInstance(WordDto, words),
    totalPages,
    currentPage: page,
  };
};
