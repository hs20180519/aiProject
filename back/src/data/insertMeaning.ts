import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function groupWords(): Promise<void> {
  const words: { meaning: string }[] = await prisma.word.findMany({
    select: { meaning: true },
  });

  const groups: any[] = [];

  for (let i = 0; i < words.length; i += 3) {
    const group: string[] = words.slice(i, i + 3).map((word) => word.meaning);
    groups.push(group);
  }

  // Transaction 생성
  const createPromises = groups.map((group) =>
    prisma.meaningGroup.create({ data: { meanings: group } }),
  );

  // 모든 create 쿼리 실행
  await prisma.$transaction(createPromises);
}

groupWords()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

// npx ts-node src/data/insertMeaning.ts
