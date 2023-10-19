import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getProgress = async (userId: number) => {
  // 총 단어
  const totalWordsCount: number = await prisma.word.count();

  // 총 단어 중 맞춘 단어
  const correctAnswersCount: number = await prisma.wordProgress.count({
    where: {
      userId,
      correct: true,
    },
  });

  // 전체 학습 백분율
  const overallPercentage: number | null =
    totalWordsCount > 0 ? Math.round((correctAnswersCount / totalWordsCount) * 100) : null;

  // 카테고리별 백분율
  let categoriesPercentages: any = {};

  let categories: string[] = ["csat", "toefl", "toeic", "custom"];

  for (let i = 0; i < categories.length; i++) {
    let categoryWordCount: number = await prisma.word.count({
      where: {
        category: categories[i],
      },
    });

    let categoryCorrectAnswer: number = await prisma.wordProgress.count({
      where: {
        userId,
        correct: true,
        word: {
          category: categories[i],
        },
      },
    });

    categoriesPercentages[categories[i]] =
      categoryWordCount > 0 ? Math.round((categoryCorrectAnswer / categoryWordCount) * 100) : null;
  }

  return {
    OverallPercentage: overallPercentage,
    CategoryPercentage: categoriesPercentages,
  };
};
