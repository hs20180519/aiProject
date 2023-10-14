import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import * as wordInterface from "../interfaces/wordInterface";

export const createChoices = async (word: wordInterface.Word) => {
  let choices = [word.meaning];

  while (choices.length < 4) {
    const randomWord = await prisma.$queryRaw<
      wordInterface.Word[]
    >`SELECT * FROM Word ORDER BY RAND() LIMIT 1`;
    const randomWordMeaning = randomWord[0].meaning;

    if (!choices.includes(randomWordMeaning)) choices.push(randomWordMeaning);
  }

  return choices;
};
