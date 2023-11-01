import { Favorite, PrismaClient, Word } from "@prisma/client";

const prisma = new PrismaClient();

export const addFavorite = async (userId: number, words: Word[]) => {
  const favoriteWords: Favorite[] = await prisma.favorite.findMany({
    where: {
      userId: userId,
      wordId: { in: words.map((word: Word) => word.id) },
    },
  });
  return words.map((word: Word) => {
    const isFavorite: boolean = favoriteWords.some(
      (favoriteWord: Favorite): boolean => favoriteWord.wordId === word.id,
    );
    return { ...word, isFavorite };
  });
};
