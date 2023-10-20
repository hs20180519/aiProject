import { CustomBook, PrismaClient, User, Word } from "@prisma/client";

const prisma = new PrismaClient();

const createMockData = async () => {
  const users: User[] = await prisma.user.findMany();

  for (let user of users) {
    // 각 사용자 customBook 생성
    const customBook: CustomBook = await prisma.customBook.create({
      data: {
        title: "Custom Book - " + user.id,
        userId: user.id,
      },
    });

    // 커스텀 단어 생성
    for (let i = 1; i <= 10; i++) {
      const word: Word = await prisma.word.create({
        data: {
          word: "Word" + i + "-User" + user.id,
          meaning: "Meaning" + i,
          category: "custom",
          customBookId: customBook.id,
        },
      });

      // 생성한 단어를 학습한것으로 간주
      await prisma.wordProgress.create({
        data: {
          userId: user.id,
          wordId: word.id,
          correct: Math.random() < 0.5, // 50% 확률로 정답
        },
      });
    }
  }
};

createMockData()
  .then(() => console.log("Mock data 생성 완료"))
  .catch((err) => console.error(err));
