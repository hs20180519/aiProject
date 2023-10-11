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

function generateMockData(num: number) {
  const categories = ["csat", "toeic", "toefl", "ielts"];

  let data = [];

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

async function insertMockData(dataArr: any[]) {
  // 500개씩 청크
  const chunkSize = 500;
  for (let i = 0; i < dataArr.length; i += chunkSize) {
    const chunk = dataArr.slice(i, i + chunkSize);
    await prisma.word.createMany({
      data: chunk,
      skipDuplicates: true,
    });
  }
}

const mockData = generateMockData(10000); // mock data 개수

insertMockData(mockData)
  .then(() => {
    console.log("Successfully inserted all the records");
  })
  .catch((err) => {
    console.error("Error inserting records:", err);
  });
