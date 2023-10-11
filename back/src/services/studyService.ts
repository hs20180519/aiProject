import { PrismaClient } from "@prisma/client";
import { createChoices } from "../utils/createChoices";
import * as wordInterface from "../interfaces/wordInterface";
import { WordWithChoicesDto } from "../dtos/wordDto";
import { WordProgressDto } from "../dtos/wordDto";
import { plainToInstance } from "class-transformer";

const prisma = new PrismaClient();

export const getExperienceWord = async () => {
  let wordsWithChoices: WordWithChoicesDto[] = [];

  const words: wordInterface.Word[] = await prisma.$queryRaw`
    SELECT * FROM Word ORDER BY RAND() LIMIT 10
  `;
  for (const word of words) {
    let choices: string[] = await createChoices(word);

    const wordWithChoices: WordWithChoicesDto = plainToInstance(WordWithChoicesDto, {
      ...word,
      choices,
    });

    wordsWithChoices.push(wordWithChoices);
  }
  return wordsWithChoices;
};

export const getWord = async (userId: number): Promise<WordWithChoicesDto | null> => {
  const wordResult: wordInterface.Word[] = await prisma.$queryRaw`
      SELECT * FROM Word 
      WHERE NOT EXISTS(
              SELECT * FROM WordProgress 
              WHERE WordProgress.wordId=Word.id AND WordProgress.userId=${userId}
            ) 
      ORDER BY RAND() LIMIT 1`;

  if (wordResult.length === 0) {
    throw new Error("단어가 없습니다.");
  }

  let word: wordInterface.Word = wordResult[0];

  let choices: string[] = await createChoices(word);

  return plainToInstance(WordWithChoicesDto, { ...word, choices });
};

export const getWordsByUserId = async (
  userId: number,
  isCorrect: boolean,
): Promise<WordWithChoicesDto> => {
  const wordResult: wordInterface.Word[] = await prisma.$queryRaw`
    SELECT Word.* FROM Word 
    INNER JOIN WordProgress ON Word.id=WordProgress.wordId
    WHERE WordProgress.userId=${userId} AND WordProgress.correct=${isCorrect}
    ORDER BY RAND() LIMIT 1`;

  if (!wordResult)
    throw new Error(
      `사용자 ID ${userId}에 대해 ${isCorrect} 상태가 올바른 단어를 찾을 수 없습니다.`,
    );

  let word: wordInterface.Word = wordResult[0];
  let choices: string[] = await createChoices(word);

  return plainToInstance(WordWithChoicesDto, { ...word, choices });
};

export const getWordsByCategory = async (
  userId: number,
  category: string,
  customBookId?: number,
): Promise<WordWithChoicesDto> => {
  let wordResult: wordInterface.Word[];

  if (customBookId) {
    wordResult = await prisma.$queryRaw`
      SELECT * FROM Word 
      WHERE customBookId = ${customBookId} AND NOT EXISTS (
        SELECT * FROM WordProgress 
        WHERE WordProgress.wordId=Word.id AND WordProgress.userId=${userId} AND WordProgress.correct=true
      ) 
      ORDER BY RAND() LIMIT 1`;
  } else {
    wordResult = await prisma.$queryRaw`
      SELECT * FROM Word 
      WHERE category = ${category} AND NOT EXISTS (
        SELECT * FROM WordProgress 
        WHERE WordProgress.wordId=Word.id AND WordProgress.userId=${userId} AND WordProgress.correct=true
      ) 
      ORDER BY RAND() LIMIT 1`;
  }

  if (wordResult.length === 0) {
    throw new Error("단어가 없습니다.");
  }

  let word: wordInterface.Word = wordResult[0];

  let choices: string[] = await createChoices(word);

  return plainToInstance(WordWithChoicesDto, { ...word, choices });
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
  const rank = await prisma.rank.findFirst({
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
  return plainToInstance(WordProgressDto, result);
};
