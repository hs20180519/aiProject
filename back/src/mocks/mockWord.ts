import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function generateRandomString(length: number): string {
  let result: string = "";
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

function generateMockData(num: number): any[] {
  const categories: string[] = ["csat", "toeic", "toefl"];

  let data: any[] = [];

  for (let i = 0; i < num; i++) {
    let wordObj: { word: string; meaning: string; category: string } = {
      word: "",
      meaning: "",
      category: "",
    };

    wordObj.word = generateRandomString(5);
    wordObj.meaning = generateRandomString(8);
    wordObj.category = categories[Math.floor(Math.random() * categories.length)];

    data.push(wordObj);
  }

  return data;
}

async function insertMockData(dataArr: any[]): Promise<void> {
  // 500개씩 청크
  const chunkSize = 500;
  for (let i = 0; i < dataArr.length; i += chunkSize) {
    const chunk: any[] = dataArr.slice(i, i + chunkSize);
    await prisma.word.createMany({
      data: chunk,
      skipDuplicates: true,
    });
  }
}

const mockData: any[] = generateMockData(50000); // mock data 개수

insertMockData(mockData)
  .then((): void => {
    console.log("모든 레코드를 성공적으로 삽입했습니다.");
  })
  .catch((err): void => {
    console.error("레코드 삽입 오류:", err);
  });

// 파일 실행하기 (생성할 레코드 수 설정 후)
// npx ts-node src/mocks/mockWord.ts
