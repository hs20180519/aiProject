import { PrismaClient, Rank, Word, WordProgress } from "@prisma/client";
import { createChoices } from "../utils/createChoices";
import * as wordInterface from "../interfaces/wordInterface";
import { WordProgressDto, WordWithChoicesDto } from "../dtos/wordDto";
import { plainToInstance } from "class-transformer";
import { addFavorites } from "../utils/addFavorites";
import { addFavorite } from "../utils/addFavorite";

const prisma = new PrismaClient();

export const getExperienceWord = async (): Promise<WordWithChoicesDto[]> => {
  let wordsWithChoices: WordWithChoicesDto[] = [];

  const words: wordInterface.Word[] = await prisma.$queryRaw`
    SELECT * FROM Word ORDER BY RAND() LIMIT 10
  `;

  const wordMeanings: string[] = words.map((word: wordInterface.Word) => word.meaning);

  const additionalMeanings: any[] = await prisma.$queryRaw`
     SELECT meaning FROM Word WHERE meaning NOT IN (${wordMeanings.join(
       ",",
     )}) ORDER BY RAND() LIMIT 30
   `;

  for (let i = 0; i < words.length; i++) {
    let choices: string[] = [
      ...additionalMeanings.slice(i * 3, (i + 1) * 3).map((obj) => obj.meaning),
      wordMeanings[i],
    ];

    const wordWithChoices: WordWithChoicesDto = plainToInstance(WordWithChoicesDto, {
      ...words[i],
      choices,
    });

    wordsWithChoices.push(wordWithChoices);
  }

  return wordsWithChoices;
};

export const getWord = async (userId: number): Promise<WordWithChoicesDto> => {
  const wordsCount: number = await prisma.word.count({
    where: {
      NOT: {
        wordProgress: {
          some: {
            userId: userId,
          },
        },
      },
    },
  });

  const skip: number = Math.floor(Math.random() * wordsCount);

  const word: Word | null = await prisma.word.findFirst({
    where: {
      NOT: {
        wordProgress: {
          some: {
            userId: userId,
          },
        },
      },
    },
    skip: skip,
  });

  if (!word) throw new Error(`사용자 ID ${userId}에 대해 단어를 찾을 수 없습니다.`);

  const wordWithFavoriteStatus = await addFavorite(userId, word);
  return await createChoices(wordWithFavoriteStatus);
};

export const getWordsByUserId = async (
  userId: number,
  isCorrect: boolean,
): Promise<WordWithChoicesDto> => {
  const wordsCount: number = await prisma.word.count({
    where: {
      wordProgress: {
        some: {
          userId: userId,
          correct: isCorrect,
        },
      },
    },
  });

  const skip: number = Math.floor(Math.random() * wordsCount);

  const word: Word | null = await prisma.word.findFirst({
    where: {
      wordProgress: {
        some: {
          userId: userId,
          correct: isCorrect,
        },
      },
    },
    skip: skip,
  });

  if (!word)
    throw new Error(
      `사용자 ID ${userId}에 대해 ${isCorrect} 상태가 올바른 단어를 찾을 수 없습니다.`,
    );

  const additionalMeanings: Word[] = await prisma.word.findMany({
    where: {
      meaning: {
        not: word.meaning,
      },
    },
    take: 3,
  });

  const choices: string[] = additionalMeanings.map((obj: Word) => obj.meaning).concat(word.meaning);

  const wordWithFavoriteStatus = await addFavorite(userId, word);

  return plainToInstance(WordWithChoicesDto, { ...wordWithFavoriteStatus, choices });
};

export const getWordsByCategory = async (
  userId: number,
  category: string,
  customBookId?: string,
): Promise<WordWithChoicesDto> => {
  const bookId: number = Number(customBookId);

  const whereClause = customBookId
    ? {
        customBookId: bookId,
        NOT: {
          wordProgress: {
            some: {
              userId: userId,
              correct: true,
            },
          },
        },
      }
    : {
        category: category,
        OR: [
          {
            NOT: {
              wordProgress: {
                some: {
                  userId: userId,
                },
              },
            },
          },
          {
            wordProgress: {
              some: {
                userId: userId,
                correct: false,
              },
            },
          },
        ],
      };

  const wordsCount: number = await prisma.word.count({
    where: whereClause,
  });

  const skip: number = Math.floor(Math.random() * wordsCount);

  const word: Word | null = await prisma.word.findFirst({
    where: whereClause,
    skip: skip,
  });

  if (!word) throw new Error(`카테고리 ${category}에 대해 단어를 찾을 수 없습니다.`);
  const wordWithFavoriteStatus = await addFavorite(userId, word);

  return await createChoices(wordWithFavoriteStatus);
};

export const saveLearn = async (
  userId: number,
  wordId: number,
  correct: boolean,
): Promise<void> => {
  await prisma.wordProgress.create({
    data: {
      userId,
      wordId,
      correct,
    },
  });
  return;
};

export const updateScore = async (userId: number): Promise<void> => {
  const rank: Rank | null = await prisma.rank.findFirst({
    where: { userId },
  });

  if (!rank) {
    await prisma.rank.create({
      data: {
        userId,
        score: 5,
      },
    });
  } else {
    await prisma.rank.update({
      where: { id: rank.id },
      data: {
        score: {
          increment: 5,
        },
      },
    });
  }
};

export const getLearnResult = async (userId: number): Promise<WordProgressDto[]> => {
  const result = await prisma.wordProgress.findMany({
    where: { userId },
    orderBy: { studiedAt: "desc" },
    take: 10,
    include: { word: true },
  });

  const sortedResult = result.sort(
    (a: WordProgress & { word: Word }, b: WordProgress & { word: Word }) => {
      const dateA: Date = new Date(a.updatedAt);
      const dateB: Date = new Date(b.updatedAt);
      return dateA.getTime() - dateB.getTime();
    },
  );

  return plainToInstance(WordProgressDto, sortedResult);
};
