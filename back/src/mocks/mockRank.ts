import { PrismaClient, Rank, User } from "@prisma/client";

const prisma = new PrismaClient();

const createMockData = async (): Promise<void> => {
  const users: User[] = await prisma.user.findMany();

  for (let user of users) {
    const rank: Rank = await prisma.rank.create({
      data: {
        score: Math.floor(Math.random() * 10000),
        userId: user.id,
      },
    });
  }
};

createMockData()
  .then(() => console.log("Rank data 생성완료"))
  .catch((e) => console.error(e));

// npx ts-node src/mocks/mockRank.ts
