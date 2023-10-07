import { PrismaClient } from "@prisma/client";
import { yatesShuffle } from "../utils/yatesShuffle";
import { createChoices } from "../utils/createChoices";

const prisma = new PrismaClient();

interface Word {
  id: number;
  meaning: string;
}

export const getTestWords = async () => {
  const wordsPerLevel = {
    "0": 3,
    "1": 4,
    "2": 3,
  };

  let unlearnedWordsWithChoices = [];

  const allUnfilteredWords = await prisma.word.findMany();

  for (const wordLevel in wordsPerLevel) {
    let unlearnedWords: Word[] = [];

    const level = wordLevel as "0" | "1" | "2";

    while (unlearnedWords.length < wordsPerLevel[level]) {
      const allWordsAtCurrentWordLevel = await prisma.word.findMany({
        where: { level: +wordLevel },
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

  return unlearnedWordsWithChoices;
};
