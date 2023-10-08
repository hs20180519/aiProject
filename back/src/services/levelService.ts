import { PrismaClient } from "@prisma/client";
import { yatesShuffle } from "../utils/yatesShuffle";
import { createChoices } from "../utils/createChoices";
import * as wordInterface from "../interfaces/wordInterface";

const prisma = new PrismaClient();
export const getTestWords = async (): Promise<wordInterface.WordWithChoices[]> => {
  const wordsPerLevel = {
    "0": 3,
    "1": 4,
    "2": 3,
  };

  let unlearnedWordsWithChoices = [];

  for (const wordLevel in wordsPerLevel) {
    let unlearnedWords: wordInterface.Word[] = [];

    const level = wordLevel as "0" | "1" | "2";

    while (unlearnedWords.length < wordsPerLevel[level]) {
      const selectedWordArray: wordInterface.Word[] =
        await prisma.$queryRaw`SELECT * FROM Word WHERE 
        Word.level=${+wordLevel} 
        ORDER BY RAND() LIMIT 1`;

      if (selectedWordArray.length === 0) break;

      const selectedWord = selectedWordArray[0];

      if (!unlearnedWords.some((word: wordInterface.Word) => word.id === selectedWord.id))
        unlearnedWords.push(selectedWord);
    }

    for (const word of unlearnedWords) {
      let choices: string[] = await createChoices(word);
      choices = yatesShuffle(choices);

      const wordWithChoices = { ...word, choices };

      unlearnedWordsWithChoices.push(wordWithChoices);
    }
  }
  return unlearnedWordsWithChoices;
};
