import { PrismaClient, Word } from "@prisma/client";
const prisma = new PrismaClient();
import * as wordInterface from "../interfaces/wordInterface";

export const createChoices = async (word: wordInterface.Word): Promise<string[]> => {
  const choicesSet = new Set<string>();
  choicesSet.add(word.meaning);

  const count = await prisma.word.count();

  while (choicesSet.size < 4) {
    const randomIndex = Math.floor(Math.random() * count);

    const randomWordRes: Word | null = await prisma.word.findFirst({
      skip: randomIndex,
    });

    if (randomWordRes) {
      choicesSet.add(randomWordRes.meaning);
    }
  }

  return Array.from(choicesSet);
};
