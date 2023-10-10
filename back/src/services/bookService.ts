import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import { BooksDto } from "../dtos/bookDto";

export const getBooks = async (userId: number): Promise<BooksDto[]> => {
  return prisma.customBook.findMany({
    where: { userId: userId },
    select: {
      id: true,
      title: true,
    },
  });
};
