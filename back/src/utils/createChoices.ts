import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import * as wordInterface from "../interfaces/wordInterface";
import { plainToInstance } from "class-transformer";
import { WordWithChoicesDto } from "../dtos/wordDto";

export const createChoices = async (word: wordInterface.Word): Promise<WordWithChoicesDto> => {
  if (!word) {
    throw new Error("단어가 없습니다.");
  }

  let wordMeaning: string = `'${word.meaning}'`;

  const additionalMeaningsGroup: any = await prisma.$queryRaw`
     SELECT meanings FROM MeaningGroup WHERE JSON_CONTAINS(meanings, JSON_ARRAY(${wordMeaning}), '$') = false LIMIT 1`;

  let additionalMeanings: string[] = additionalMeaningsGroup.flatMap(
    (group: { meanings: any }) => group.meanings,
  );

  let choices: string[] = [...additionalMeanings, word.meaning];

  return plainToInstance(WordWithChoicesDto, { ...word, choices });
};
