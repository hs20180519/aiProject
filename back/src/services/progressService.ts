import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getProgress = async (userId: number) => {
  const totalWordsCount: number = await prisma.word.count();

  const correctAnswersCount: number = await prisma.wordProgress.count({
    where: {
      userId,
      correct: true,
    },
  });

  // 전체 백분율
  const overallPercentage: string | null =
    totalWordsCount > 0 ? ((correctAnswersCount / totalWordsCount) * 100).toFixed(2) : null;

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
      categoryWordCount > 0 ? ((categoryCorrectAnswer / categoryWordCount) * 100).toFixed(2) : null;
  }

  return {
    OverallPercentage: overallPercentage,
    CategoryPercentage: categoriesPercentages,
  };
};
