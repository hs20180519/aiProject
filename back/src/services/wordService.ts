import { PrismaClient } from "@prisma/client";
import { shuffleAnswer } from "../utils/shuffleAnswer";
import { createChoices } from "../utils/createChoices";
import { yatesShuffle } from "../utils/yatesShuffle";
import { getRandomLevel } from "../utils/getRandomLevel";
import * as wordInterface from "../interfaces/wordInterface";

const prisma = new PrismaClient();

export const getWord = async (userId: number): Promise<wordInterface.WordWithChoices | null> => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { level: true },
  });

  if (!user) {
    throw new Error(`사용자 ID: ${userId} 를 찾을 수 없습니다.`);
  }

  let selectedWordWithChoices = null;

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

    const selectedWordArray: wordInterface.Word[] = await prisma.$queryRaw`SELECT * FROM Word WHERE 
       Word.level=${randomLevel} AND 
       NOT EXISTS(SELECT * FROM WordProgress WHERE WordProgress.wordId=Word.id AND WordProgress.userId=${userId}) 
       ORDER BY RAND() LIMIT 1`;

    if (selectedWordArray.length === 0) throw new Error("No words found at this Level");

    const selectedWord: wordInterface.Word = selectedWordArray[0];

    let choices: string[] = await createChoices(selectedWord);

    choices = yatesShuffle(choices);

    selectedWordWithChoices = { ...selectedWord, choices };
  }
  return selectedWordWithChoices;
};

export const getWordsByUserId = async (
  userId: number,
  isCorrect: boolean | null,
): Promise<wordInterface.WordWithChoices[]> => {
  let words;

  if (isCorrect === null) {
    words = await prisma.wordProgress.findMany({
      where: {
        userId,
      },
      include: {
        word: true,
      },
    });
  } else {
    words = await prisma.wordProgress.findMany({
      where: {
        userId,
        correct: isCorrect,
      },
      include: {
        word: true,
      },
    });
  }

  let wordsWithChoices = [];

  for (let wordObj of words) {
    let choices: string[] = [wordObj.word.meaning];

    await shuffleAnswer(choices);

    let wordWithChoices = { ...wordObj.word, choices };
    wordsWithChoices.push(wordWithChoices);
  }

  return wordsWithChoices;
};

export const getWordsByCustomBookId = async (
  customBookId: number,
): Promise<wordInterface.WordWithChoices[]> => {
  const customBookWords = await prisma.wordbookEntry.findMany({
    where: {
      wordbookId: customBookId,
    },
    include: {
      word: true,
    },
  });

  let wordsWithChoices = [];

  for (let customBookWord of customBookWords) {
    let choices: string[] = [customBookWord.word.meaning];

    await shuffleAnswer(choices);

    let wordWithChoices = { ...customBookWord.word, choices };

    wordsWithChoices.push(wordWithChoices);
  }

  return wordsWithChoices;
};
