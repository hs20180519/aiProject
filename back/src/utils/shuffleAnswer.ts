import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const shuffleAnswer = async (choices: string[]) => {
  while (choices.length < 4) {
    const wordsCount = await prisma.word.count();
    const randomMeaningIndex = Math.floor(Math.random() * wordsCount);
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
};
