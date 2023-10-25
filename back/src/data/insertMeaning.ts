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

  for (const group of groups) {
    await prisma.meaningGroup.create({
      data: { meanings: group },
    });
  }
}

groupWords()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

// npx ts-node src/data/insertMeaning.ts

// 다음에 추가할 때 이걸로해보기 (테스트 안해봄)
// async function groupWords(): Promise<void> {
//   const words: { meaning: string }[] = await prisma.word.findMany({
//     select: { meaning: true },
//   });
//
//   const groups: any[] = [];
//
//   for (let i = 0; i < words.length; i += 3) {
//     const group: string[] = words.slice(i, i + 3).map((word) => word.meaning);
//     groups.push(group);
//   }
//
//   // Transaction 생성
//   const createPromises = groups.map(group =>
//     prisma.meaningGroup.create({ data: { meanings: group } })
//   );
//
//    // 모든 create 쿼리 실행
//    await prisma.$transaction(createPromises);
// }
//
// groupWords()
//  .catch(console.error)
//  .finally(() => prisma.$disconnect());
