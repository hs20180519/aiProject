import { PrismaClient } from "@prisma/client";
import { RankDto } from "../dtos/rankDto";
import { plainToInstance } from "class-transformer";

// 처음 유저가 접속했을 때는 유저의 점수는 0점
// 유저가 학습을 완료함
// 유저의 단어 학습을 한 사이클 한 후, 맞춘 단어로 점수를 산출해 DB로 저장됨
// 기존 rank.score에 점수가 ++됨
// 점수 순으로 유저 등수가 변화됨. 점수테이블이 따로 있어야할 듯..? UserRank/ index(=등수), userId, score
// -> 아닌가 그냥 유저 점수순으로 데이터를 보내주면 되는건가? 프론트에서 설정을 해줘야하나? db에 그 순으로 map 함수로 출력해달라고하면되는 건가?
// DB에서 유저 랭킹 순으로 인덱스를 매겨서 데이터를 갖고 있다가 프론트로 보내준다?
// 수시로 변경되는 점수라면 DB로 갖고 있는게 아니라 프론트딴에서 출력을 하는게 나은가? 디비에서 어떻게 처리를 해줘야하자..?
//
// 점수 순으로 유저 등수가 변화되는 건 -> 1.유저랭킹 반영 시간을 정하거나 2. 유저학습 변화가 있을때마다 등수가 변하게하거나해야됨.
//
// 유저 점수 초기화는 1주일에 한번 node-cron사용 -> 어디에서 사용할건지? 8000처음 서버 호출할때..?

/*

서비스
1. 유저 랭킹리스트 조회
2. 
*/
const prisma = new PrismaClient();

export interface UsersRank {
  userId: number;
  rank: number;
  score: number;
}

export class rankService {
  /** 유저 학습 점수와 닉네임을 점수 오름차순으로 가져옴 */
  async getUsersRankList(rank: UsersRank) {
    const getUsersRankList = await prisma.rank.findMany({
      select: {
        score: true,
        user: {
          select: { nickname: true },
        },
      },
      orderBy: {
        score: "asc",
      },
    });

    return getUsersRankList;
  }

  async getUserNickname(userId: UsersRank) {
    const getUserNickname = await prisma.user.findUnique({
      where: { id: userId },
    });
  }

  /**
   * 현재 유저 랭킹을 출력
   * 현재 랭킹을 저장하는 것도 있어야할 듯
   */
  async getCurrentUserRank(req: Request, res: Response) {
    const getRankList = await prisma.$queryRaw`
    SELECT user, score, rankDate From Rank`;
  }
  /**유저가 조회한 시점으로 해당 유저의 index값 저장 */
  async postUserRankIndex() {
    const userRanking = await prisma.$queryRaw`
    INSERT INTO User VALUE ()`;
    return userRanking;
  }

  /** 유저가 /rank접속시 이전 랭킹과 현재 접속한 랭킹 차 구하기 */
  async post() {
    // const resultN = await prisma.$queryRaw`계산하는 쿼리 넣기`;
  }

  /** 모든 유저의 score를 0으로 업데이트 */
  async resetUserScores() {
    try {
      const updatedUsers = await prisma.user?.updateMany({
        user: {
          score: 0,
        },
      });

      console.log(`Score reset for ${updatedUsers.count} users.`);
    } catch (error) {
      console.error("Error resetting user scores:", error);
    }
  }
}

export const rank = new rankService();

/* 
async function rankService(userId: number): Promise<UserDto> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    const currentRanking = await prisma.rank.findMany({
      where: { userId: user?.id },
      orderBy: {
        rankDate: "desc",
      },
    });

    const previousRanking = await prisma.rank.findMany({
      where: { userId: user?.id },
      orderBy: {
        rankDate: "asc",
      },
    });

    if (currentRanking.length === 0 || previousRanking.length === 0) {
      throw new Error("현재 순위가 없습니다.");
    }

    const currentRank = currentRanking[0].score;
    const previousRank = previousRanking[0].score;

    const rankingChange = previousRank - currentRank;

    return {
      currentRank,
      rankingChange,
    };
    // return plainToInstance(UserDto, user);
  } catch (error) {
    throw new Error("Error while calculating ranking change");
  }
}
*/
