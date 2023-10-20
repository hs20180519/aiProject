import { PrismaClient, User, Word } from "@prisma/client";

const prisma = new PrismaClient();

const learnRandomWords = async (user: User, learningCount: number) => {
  // 모든 단어 가져오기
  const words: Word[] = await prisma.word.findMany();

  for (let i = 0; i < learningCount; i++) {
    // 랜덤한 단어 선택하기
    const randomWord = words[Math.floor(Math.random() * words.length)];

    // 선택한 단어를 학습한것으로 간주
    await prisma.wordProgress.create({
      data: {
        userId: user.id,
        wordId: randomWord.id,
        correct: Math.random() < 0.5, // 50% 확률로 정답
      },
    });
  }
};

const createMockData = async (): Promise<void> => {
  const users: User[] = await prisma.user.findMany();

  for (let user of users) {
    /* 여기서 원하는 학습 횟수를 설정하세요. */
    let learningCountPerUser: number = 1000;

    /* 유저마다 랜덤 단어 학습 */
    await learnRandomWords(user, learningCountPerUser);
  }
};

createMockData()
  .then(() => console.log("Mock data 생성 완료"))
  .catch((err) => console.error(err));
