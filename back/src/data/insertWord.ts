import { PrismaClient } from "@prisma/client";
import csv from "csv-parser";
import * as fs from "fs";

const prisma = new PrismaClient();

interface RowType {
  word: string;
  meaning: string;
  category: string;
}

async function main(): Promise<void> {
  try {
    // CSV 파일 경로
    const filePath = "./output2.csv";

    // CSV 파일을 읽어서 데이터베이스에 넣기
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", async (row: RowType): Promise<void> => {
        const { word, meaning, category } = row;

        // Word 모델에 데이터 넣기
        await prisma.word.create({
          data: {
            word,
            meaning,
            category,
          },
        });
      })
      .on("end", (): void => {
        console.log("데이터 적재 완료");
      });
  } catch (error) {
    console.error("오류 발생:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  throw e;
});
