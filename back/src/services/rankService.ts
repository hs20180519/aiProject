import { PrismaClient, User, Rank } from "@prisma/client";
import { RankDto } from "../dtos/rankDto";
import { UserDto } from "../dtos/userDto";
import { plainToInstance } from "class-transformer";
import { UsersRank, RankData } from "../interfaces/rankInterface";

const prisma = new PrismaClient();

/*
 * 가져올 값
 * 1. 유저 전체 순위 목록 1위~100위 = userRankList
 * 2. 로그인한 유저의 현재 순위 = currentRank
 * 3. 로그인한 유저의 이전 순위 = pastRank
 * 4. 로그인한 유저의 현재순위 - 이전순위 = 순위변화(changedRank)
 */

//todo 반환객체에 DTO 패턴 적용하기
/** 유저 학습 점수와 닉네임을 점수 내림차순으로 가져옴
 *
 */
export const getUsersRankList = async (user: User) => {
  const usersRankList = await prisma.rank.findMany({
    select: {
      score: true,
      user: {
        select: { nickname: true },
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
  const userRank = await prisma.user.findUnique({
    where: { id: user.id },
    // select: { rank: user.rank },
  });
  return userRank;
};
/** 유저 랭킹차 */
// export const userGapRank = async (user: UserDto) => {
//   const pastRank: User | null = await prisma.user.findUnique({
//     where: { id: userId },
//     select: { pastRank },
//   });

//   const currentRank: User | null = await prisma.user.upsert({
//     where: { userId },
//     select: { currentRank },
//   });
//   const changedRank = parseInt(pastRank) - parseInt(currentRank);

//   return changedRank;
// };
