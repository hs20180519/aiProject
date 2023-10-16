import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import * as wordInterface from "../interfaces/wordInterface";
import { plainToInstance } from "class-transformer";
import { WordWithChoicesDto } from "../dtos/wordDto";

export const createChoices = async (
  wordResult: wordInterface.Word[],
): Promise<WordWithChoicesDto[]> => {
  if (wordResult.length === 0) {
    throw new Error("단어가 없습니다.");
  }

  let words: wordInterface.Word[] = [...wordResult];

  let wordMeanings: string[] = words.map((word) => `'${word.meaning}'`);

  const additionalMeaningsGroups: any[] = await prisma.$queryRaw`
     SELECT meanings FROM MeaningGroup WHERE JSON_CONTAINS(meanings, JSON_ARRAY(${wordMeanings.join(
       ",",
     )}), '$') = false LIMIT ${words.length}`;

  let choicesSet: string[][] = [];

  for (let i = 0; i < words.length; i++) {
    let additionalMeanings: string[] = additionalMeaningsGroups
      .slice(i * 3, (i + 1) * 3)
      .flatMap((group) => group.meanings);

    choicesSet[i] = [...additionalMeanings, words[i].meaning];
  }

  return words.map((word, index) =>
    plainToInstance(WordWithChoicesDto, { ...word, choices: choicesSet[index] }),
  );
};
