import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import { shuffleAnswer } from "../utils/shuffleAnswer";

interface Word {
  id: number;
  meaning: string;
}

export const getWords = async (userId: number) => {
  const allWords = await prisma.word.findMany({
    where: {
      NOT: {
        WordProgress: {
          some: {
            userId,
          },
        },
      },
    },
  });

  const unlearnedWords: Word[] = [];

  while (unlearnedWords.length < Math.min(10, allWords.length)) {
    const randomIndex = Math.floor(Math.random() * allWords.length);
    if (!unlearnedWords.includes(allWords[randomIndex])) {
      unlearnedWords.push(allWords[randomIndex]);
    }
  }

  let unlearnedWordsWithChoices = [];

  for (let word of unlearnedWords) {
    let choices = [word.meaning];

    while (choices.length < 4) {
      const randomMeaningIndex = Math.floor(Math.random() * allWords.length);
      const randomWord = await prisma.word.findFirst({
        skip: randomMeaningIndex,
      });

      if (randomWord && !choices.includes(randomWord.meaning)) {
        choices.push(randomWord.meaning);
      }
    }

    for (let i = choices.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [choices[i], choices[j]] = [choices[j], choices[i]];
    }

    let wordWithChoices = { ...word, choices };
    unlearnedWordsWithChoices.push(wordWithChoices);
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
