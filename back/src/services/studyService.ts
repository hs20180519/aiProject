import { PrismaClient } from "@prisma/client";
import { createChoices } from "../utils/createChoices";
import { getRandomLevel } from "../utils/getRandomLevel";
import * as wordInterface from "../interfaces/wordInterface";
import { WordWithChoicesDto } from "../dtos/wordDto";
import { WordProgressDto } from "../dtos/wordDto";
import { plainToInstance } from "class-transformer";

const prisma = new PrismaClient();

export const getWord = async (userId: number): Promise<WordWithChoicesDto | null> => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { level: true },
  });

  if (!user) {
    throw new Error(`사용자 ID: ${userId} 를 찾을 수 없습니다.`);
  }

  if (user.level !== null) {
    // 사용자의 레벨에 따라 단어 레벨 확률 정의
    let levelProbabilities;
    switch (user.level) {
      case 0:
        levelProbabilities = [0.7, 0.2, 0.1];
        break;
      case 1:
        levelProbabilities = [0.2, 0.6, 0.2];
        break;
      case 2:
        levelProbabilities = [0.1, 0.2, 0.7];
        break;
      default:
        throw new Error("유효하지 않은 레벨입니다.");
    }

    const randomLevel: number = getRandomLevel(levelProbabilities);

    const wordResult: wordInterface.Word[] = await prisma.$queryRaw`SELECT * FROM Word WHERE 
       Word.level=${randomLevel} AND 
       NOT EXISTS(SELECT * FROM WordProgress WHERE WordProgress.wordId=Word.id AND WordProgress.userId=${userId}) 
       ORDER BY RAND() LIMIT 1`;
    if (wordResult.length === 0) throw new Error("단어가 없습니다.");

    let word: wordInterface.Word = wordResult[0];
    let choices: string[] = await createChoices(word);

    return plainToInstance(WordWithChoicesDto, { ...word, choices });
  }
  throw new Error("사용자 레벨이 null 입니다.");
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

export const getWordsByCustomBookId = async (customBookId: number): Promise<WordWithChoicesDto> => {
  const wordResult: wordInterface.Word[] = await prisma.$queryRaw`
    SELECT Word.* FROM WordbookEntry
    INNER JOIN Word ON Word.id = WordbookEntry.wordId
    WHERE WordbookEntry.wordbookId = ${customBookId}
    ORDER BY RAND() LIMIT 1`;

  if (!wordResult)
    throw new Error(`커스텀 단어장 ID ${customBookId}에 대한 단어를 찾을 수 없습니다.`);

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

export const updateScore = async (userId: number, level: number): Promise<void> => {
  const rank = await prisma.rank.findFirst({
    where: { userId },
  });

  if (!rank) {
    await prisma.rank.create({
      data: {
        userId,
        score: level * 5,
      },
    });
  } else {
    await prisma.rank.update({
      where: { id: rank.id },
      data: {
        score: {
          increment: level * 5,
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
