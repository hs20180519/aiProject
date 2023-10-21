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
 * 2. 로그인한 유저의 현재 순위 = currentRank
 * 3. 로그인한 유저의 이전 순위 = pastRank
 * 4. 로그인한 유저의 현재순위 - 이전순위 = 순위변화(changedRank)
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
export const updateUserRank6pm = async (rank: Rank) => {
  cron.schedule("0 18 * * ,", (rank) => {});
};
/** 매일 오전 8시 유저랭킹 저장 */

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

// 0. 점수 증가시키기 전에 현재 등수 저장
// 1. 점수 증가시킴
// 2. 현재 등수 구하려면 점수 리스트 정렬
// 3.
