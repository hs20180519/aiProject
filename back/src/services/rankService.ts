import { PrismaClient } from "@prisma/client";
import { RankDto } from "../dtos/rankDto";
import { UserDto } from "../dtos/userDto";
import { plainToInstance } from "class-transformer";
import getPaginationParams from "../utils/getPaginationParams";
import cron from "node-cron";

const prisma = new PrismaClient();

//todo 페이징
/** 유저 학습 점수와 닉네임을 점수 내림차순으로 가져옴 */
export const getUsersRankList = async (page?: number, limit?: number): Promise<RankDto[]> => {
  const totalRankCount: number = await prisma.rank.count();
  const totalPages: number = Math.ceil(totalRankCount / (limit ?? 10));
  const offset: { skip: number; take: number } = getPaginationParams(page, limit);
  const rankList = await prisma.rank.findMany({
    orderBy: { score: "desc" },
    select: {
      userId: true,
      score: true,
      user: {
        select: { name: true, nickname: true, profileImage: true },
      },
    },
    ...offset,
  });

  return plainToInstance(
    RankDto,
    rankList.map((rankInfo, index) => ({
      ...rankInfo,
      ...rankInfo.user,
      rank: index + 1,
      currentPage: offset.skip + 1,
      totalPage: totalPages,
    })),
  );
};

export const getUserRank = async (): Promise<RankDto[]> => {
  const users = await prisma.rank.findMany({
    orderBy: {
      score: "desc",
    },
    select: {
      userId: true,
      score: true,
      currentRank: true,
      user: {
        select: { name: true, nickname: true, profileImage: true },
      },
    },
  });

  let rank = 1;
  for (const user of users) {
    await prisma.rank.update({
      where: { userId: user.userId },
      data: { currentRank: rank },
    });
    rank++;
  }

  return plainToInstance(
    RankDto,
    users.map((user) => ({
      nickname: user.user.nickname,
      profileImage: user.user.profileImage,
      score: user.score,
      currentRank: user.currentRank,
    })),
  );
};

// export const getRankGap = async () => {
//   const users = await prisma.rank.findMany({
//     select: {
//       id: true,
//       currentRank: true,
//       pastRank: true,
//     },
//   });

//   for (const user of users) {
//     if (user.pastRank) {
//       const gap = user?.pastRank - user?.currentRank;
//       // You can perform actions with the gap value, or update the database as needed
//       console.log(`User ID: ${user.id}, Rank Gap: ${gap}`);
//     }
//   }
// };

export const updateRankCron = () => {
  cron.schedule("0 18 * * *", async () => {
    const users = await prisma.rank.findMany({
      select: {
        userId: true,
        currentRank: true,
      },
    });

    for (const user of users) {
      await prisma.rank.update({
        where: { userId: user.userId },
        data: { pastRank: user.currentRank },
      });
    }
  });
};
