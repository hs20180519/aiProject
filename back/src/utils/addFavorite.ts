import { Favorite, PrismaClient, Word } from "@prisma/client";
import * as wordInterface from "../interfaces/wordInterface";

const prisma = new PrismaClient();

export const addFavorite = async (userId: number, word: wordInterface.Word) => {
  const favoriteWords: Favorite[] = await prisma.favorite.findMany({
    where: {
      userId: userId,
      wordId: word.id,
    },
  });

  const isFavorite: boolean = favoriteWords.length > 0;

  return { ...word, isFavorite };
};
