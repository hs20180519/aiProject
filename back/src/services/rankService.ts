import { PrismaClient, User, Rank } from "@prisma/client";
import { RankDto } from "../dtos/rankDto";
import { UserDto } from "../dtos/userDto";
import { plainToInstance } from "class-transformer";
import { UsersRank, RankData } from "../interfaces/rankInterface";
import cron from "node-cron";

const prisma = new PrismaClient();

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

//todo 반환객체에 DTO 패턴 적용하기
/** 유저 학습 점수와 닉네임을 점수 내림차순으로 가져옴 */
export const getUsersRankList = async () => {
  const usersRankList = await prisma.rank.findMany({
    select: {
      score: true,
      user: {
        select: { nickname: true, email: true },
      },
    },
    orderBy: {
      score: "desc",
    },
  });

  return usersRankList;
};

/** 현재 로그인한 유저 랭킹 조회*/
export const getUserRank = async (user: User) => {
  const rankList = await getUsersRankList();
  const rank = rankList.findIndex((rank) => rank.user.email === user.email);
  return rank + 1;
};

/** 매일 오후 6시 유저랭킹 저장 */
export const updateUserRank6pm = async (user: User) => {
  cron.schedule("0 18 * * ,", async (rank) => {
    const rankList = await getUsersRankList();
    const userRank = rankList.findIndex((rank) => rank.user.email === user.email);
    return userRank + 1;
  });
};

/** 매일 오전 8시 유저랭킹 저장 */
export const updateUserRank8am = async (user: User) => {
  cron.schedule("0 8 * * ,", async (rank) => {
    const rankList = await getUsersRankList();
    const userRank = rankList.findIndex((rank) => rank.user.email === user.email);
    return userRank + 1;
  });
};

/** 유저 랭킹차 */
export const userGapRank = async (user: User) => {
  const currentRank = await getUserRank(user);
  const findUser = await prisma.rank.findUnique({
    where: {
      user: {
        email: user.email,
      },
    },
  });

  if (findUser?.pastRank) {
    const gap = currentRank - findUser.pastRank;
    return gap;
  }
};
