import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
interface Word {
  id: number;
  meaning: string;
}
interface RawWord {
  id: number;
  level: number;
  meaning: string;
}

export const createChoices = async (word: Word) => {
  let choices = [word.meaning];

  while (choices.length < 4) {
    const randomWord = await prisma.$queryRaw<
      RawWord[]
    >`SELECT * FROM Word ORDER BY RAND() LIMIT 1`;
    const randomWordMeaning = randomWord[0].meaning;

    if (!choices.includes(randomWordMeaning)) choices.push(randomWordMeaning);
  }

  return choices;
};
