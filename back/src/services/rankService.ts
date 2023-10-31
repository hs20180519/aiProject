import { PrismaClient, Rank } from "@prisma/client";
const prisma = new PrismaClient();
import { RankDto } from "../dtos/rankDto";
import { plainToInstance } from "class-transformer";
import getPaginationParams from "../utils/getPaginationParams";
/*
 * 가져올 값
 * 1. 유저 전체 순위 목록 1위~100위 = userRankList
 * 2. 로그인한 유저의 오늘 순위 = todayRank
 * 3. 로그인한 유저의 어제 순위 = yesterdayRank
 * 4. 로그인한 유저의 오늘순위 - 어제순위 = 순위변화(changedRank)
 *
 * 일주일에 한번 매주 월요일 아침 유저 순위 리셋
 * 하루에 두번 유저랭킹값 저장하여 유저에게 랭킹변화를 보여줌으로 학습 유도
 *
 */

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

/** 현재 로그인한 유저 랭킹 조회*/
export const getUserRank = async (userId: number): Promise<number> => {
  const rankList: RankDto[] = await getUsersRankList();
  const rank = rankList.findIndex((rank) => rank.userId === userId);
  return rank + 1;
};

/** 유저 랭킹차 */
export const userGapRank = async (userId: number) => {
  const currentRank = await getUserRank(userId);
  const findUser: Rank | null = await prisma.rank.findUnique({
    where: {
      id: userId,
    },
  });
  if (findUser?.pastRank) {
    return currentRank - findUser.pastRank;
  }
};

// todo 스케쥴러
// 오늘의 총점

/** 매일 오후 6시 유저랭킹 저장 */
// export const updateUserRank6pm = async (user: User) => {
//   cron.schedule("0 18 * * ,", async (rank) => {
//     const rankList = await getUsersRankList();
//     const userRank = rankList.findIndex((rank) => rank.user.id === user.id);
//     return userRank + 1;
//   });
// };
//
// /** 매일 오전 8시 유저랭킹 저장 */
// export const updateUserRank8am = async (user: User) => {
//   cron.schedule("0 8 * * ,", async (rank) => {
//     const rankList = await getUsersRankList();
//     const userRank = rankList.findIndex((rank) => rank.user.id === user.id);
//     return userRank + 1;
//   });
// };
