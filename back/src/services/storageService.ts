import getPaginationParams from "../utils/getPaginationParams";
import { plainToInstance } from "class-transformer";
import { WordDto } from "../dtos/wordDto";
import { Word } from "../interfaces/wordInterface";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const getAllWords = async (page: number, limit: number) => {
  const totalWordCount: number = await prisma.word.count({});
  const totalPages: number = Math.ceil(totalWordCount / (limit ?? 10));
  const offset: { take: number; skip: number } = getPaginationParams(page, limit);

  const words: Word[] = await prisma.word.findMany({
    where: {
      category: {
        not: "custom",
      },
    },
    orderBy: { word: "asc" },
    ...offset,
  });
  return { words: plainToInstance(WordDto, words), totalPages, currentPage: page };
};
