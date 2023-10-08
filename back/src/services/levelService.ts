import { PrismaClient } from "@prisma/client";
import { yatesShuffle } from "../utils/yatesShuffle";
import { createChoices } from "../utils/createChoices";
import * as wordInterface from "../interfaces/wordInterface";
import { plainToInstance } from "class-transformer";
import { WordWithChoicesDto } from "../dtos/wordDto";

const prisma = new PrismaClient();
export const getTestWords = async (): Promise<WordWithChoicesDto[]> => {
  const wordsPerLevel = {
    "0": 3,
    "1": 4,
    "2": 3,
  };

  let wordsWithChoices: WordWithChoicesDto[] = [];

  for (const wordLevel in wordsPerLevel) {
    let words: wordInterface.Word[] = [];

    const level = wordLevel as "0" | "1" | "2";

    while (words.length < wordsPerLevel[level]) {
      const selectedWordArray: wordInterface.Word[] =
        await prisma.$queryRaw`SELECT * FROM Word WHERE 
        Word.level=${+wordLevel} 
        ORDER BY RAND() LIMIT 1`;

      if (selectedWordArray.length === 0) break;

      const selectedWord: wordInterface.Word = selectedWordArray[0];

      if (!words.some((word: wordInterface.Word): boolean => word.id === selectedWord.id))
        words.push(selectedWord);
    }

    for (const word of words) {
      let choices: string[] = await createChoices(word);

      const wordWithChoices = plainToInstance(WordWithChoicesDto, { ...word, choices });

      wordsWithChoices.push(wordWithChoices);
    }
  }
  return wordsWithChoices;
};
