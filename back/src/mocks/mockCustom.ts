import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const createMockData = async () => {
  const users = await prisma.user.findMany();

  for (let user of users) {
    const customBook = await prisma.customBook.create({
      data: {
        title: "Custom Book - " + user.id,
        userId: user.id,
      },
    });

    let wordActions = [];
    for (let i = 1; i <= 10; i++) {
      wordActions.push(
        prisma.word.create({
          data: {
            word: "Word" + i + "-User" + user.id,
            meaning: "Meaning" + i,
            category: "custom",
            customBookId: customBook.id,
          },
        }),
      );
    }

    const words = await prisma.$transaction(wordActions);

    let progressActions = words.map((word) =>
      prisma.wordProgress.create({
        data: {
          userId: user.id,
          wordId: word.id,
          correct: Math.random() < 0.5, // 50% 확률로 정답
        },
      }),
    );

    await prisma.$transaction(progressActions);
  }
};

createMockData()
  .then(() => console.log("Mock data 생성 완료"))
  .catch((err) => console.error(err));

// npx ts-node src/mocks/mockCustom.ts
