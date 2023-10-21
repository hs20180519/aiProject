import { PrismaClient } from "@prisma/client";
import { createChoices } from "../utils/createChoices";
import * as wordInterface from "../interfaces/wordInterface";
import { WordProgressDto, WordWithChoicesDto } from "../dtos/wordDto";
import { plainToClass, plainToInstance } from "class-transformer";

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
  const wordResult: wordInterface.Word[] = await prisma.$queryRaw`
      SELECT * FROM Word 
      WHERE NOT EXISTS(
              SELECT * FROM WordProgress 
              WHERE WordProgress.wordId=Word.id AND WordProgress.userId=${userId}
            ) 
      ORDER BY RAND() LIMIT 1`;
  const word: wordInterface.Word = wordResult[0];
  return await createChoices(word);
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

  const additionalMeanings: any[] = await prisma.$queryRaw`
     SELECT meaning FROM Word WHERE meaning != '${word.meaning}' ORDER BY RAND() LIMIT 3
   `;

  let choices: string[] = [...additionalMeanings.map((obj) => obj.meaning), word.meaning];

  return plainToInstance(WordWithChoicesDto, { ...word, choices });
};

export const getWordsByCategory = async (
  userId: number,
  category: string,
  customBookId?: string,
): Promise<WordWithChoicesDto> => {
  let wordResult: wordInterface.Word[];

  const bookId: number = Number(customBookId);

  if (customBookId) {
    wordResult = await prisma.$queryRaw`
     SELECT * FROM Word 
WHERE customBookId = ${bookId} AND (
  NOT EXISTS (
    SELECT * FROM WordProgress 
    WHERE WordProgress.wordId=Word.id AND WordProgress.userId=${userId}
  ) OR
  EXISTS (
    SELECT * FROM WordProgress 
    WHERE WordProgress.wordId=Word.id AND WordProgress.userId=${userId} AND WordProgress.correct=false
  )
) 
ORDER BY RAND() LIMIT 1`;
  } else {
    wordResult = await prisma.$queryRaw`
      SELECT * FROM Word 
      WHERE category = ${category} AND (
        NOT EXISTS (
          SELECT * FROM WordProgress 
          WHERE WordProgress.wordId=Word.id AND WordProgress.userId=${userId}
        ) OR
        NOT EXISTS (
          SELECT * FROM WordProgress 
          WHERE WordProgress.wordId=Word.id AND WordProgress.userId=${userId} AND WordProgress.correct=true
        )
      ) 
      ORDER BY RAND() LIMIT 1`;
  }
  const word: wordInterface.Word = wordResult[0];

  return await createChoices(word);
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
