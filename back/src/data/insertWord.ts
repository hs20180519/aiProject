import { PrismaClient } from "@prisma/client";
import csv from "csv-parser";
import * as fs from "fs";
import path from "path";
import * as readline from "readline";

const prisma = new PrismaClient();

interface RowType {
  word: string;
  meaning: string;
  category: string;
}

async function main(): Promise<void> {
  try {
    const filePath: string = path.join(__dirname, "output2.csv");
    const fileStream: fs.ReadStream = fs.createReadStream(filePath);
    const rl: readline.Interface = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity,
    });

    let dataArr: RowType[] = [];

    for await (const line of rl) {
      const [word, meaning, category] = line.split(",");

      dataArr.push({ word, meaning, category });

      if (dataArr.length >= 500) {
        await insertData(dataArr);
        dataArr = [];
      }
    }

    if (dataArr.length > 0) await insertData(dataArr);

    console.log("데이터 적재 완료");
  } catch (error) {
    console.error("오류 발생:", error);
  } finally {
    await prisma.$disconnect();
  }
}

async function insertData(dataArray: RowType[]): Promise<void> {
  await prisma.word.createMany({
    data: dataArray,
    skipDuplicates: true,
  });
}

// npx ts-node src/data/insertWord.ts
