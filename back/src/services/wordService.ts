import { PrismaClient } from "@prisma/client";
import { shuffleAnswer } from "../utils/shuffleAnswer";
import { createChoices } from "../utils/createChoices";
import { yatesShuffle } from "../utils/yatesShuffle";
const prisma = new PrismaClient();

interface Word {
  id: number;
  meaning: string;
}
interface WordsPerLevel {
  [level: number]: { [subLevel: number]: number };
}

export const getWords = async (userId: number): Promise<Word[]> => {
  const userLevel = await prisma.user.findUnique({
    where: { id: userId },
    select: { level: true },
  });

  if (!userLevel) {
    throw new Error(`사용자 ID: ${userId} 를 찾을 수 없습니다.`);
  }

  const wordsPerLevel: WordsPerLevel = {
    "0": { "0": 7, "1": 3 },
    "1": { "0": 2, "1": 6, "2": 2 },
    "2": { "1": 3, "2": 7 },
  };

  let unlearnedWordsWithChoices = [];

  const allUnfilteredWords = await prisma.word.findMany();

  if (userLevel.level !== null) {
    for (const wordLevel in wordsPerLevel[userLevel.level]) {
      let unlearnedWords: Word[] = [];

      while (unlearnedWords.length < wordsPerLevel[userLevel.level][+wordLevel]) {
        const allWordsAtCurrentWordLevel = await prisma.word.findMany({
          where: {
            AND: [
              { level: +wordLevel },
              {
                NOT: {
                  WordProgress: { some: { userId } },
                },
              },
            ],
          },
        });

        if (!allWordsAtCurrentWordLevel.length) break;

        const randomIndex = Math.floor(Math.random() * allWordsAtCurrentWordLevel.length);

        if (!unlearnedWords.some((word) => word.id === allWordsAtCurrentWordLevel[randomIndex].id))
          unlearnedWords.push(allWordsAtCurrentWordLevel[randomIndex]);
      }

      for (const word of unlearnedWords) {
        let choices: string[] = createChoices(word, allUnfilteredWords);
        choices = yatesShuffle(choices);

        const wordWithChoices = { ...word, choices };

        unlearnedWordsWithChoices.push(wordWithChoices);
      }
    }
  }

  return unlearnedWordsWithChoices;
};

export const getWordsByUserId = async (userId: number, isCorrect: boolean | null) => {
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
    let choices = [wordObj.word.meaning];

    await shuffleAnswer(choices);

    let wordWithChoices = { ...wordObj.word, choices };
    wordsWithChoices.push(wordWithChoices);
  }

  return wordsWithChoices;
};

export const getWordsByCustomBookId = async (customBookId: number) => {
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
    let choices = [customBookWord.word.meaning];

    await shuffleAnswer(choices);

    let wordWithChoices = { ...customBookWord.word, choices };

    wordsWithChoices.push(wordWithChoices);
  }

  return wordsWithChoices;
};
