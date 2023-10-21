import { PrismaClient } from "@prisma/client";
import { RankDto } from "../dtos/rankDto";
import { UserDto } from "../dtos/userDto";
import { plainToInstance } from "class-transformer";

const prisma = new PrismaClient();

// todo 인터페이스 모듈화
export interface UsersRank {
  userId: number;
  rank: number;
  score: number;
}

export class rankService {
  //todo 반환객체에 DTO 패턴 적용하기
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
        score: "desc",
      },
    });

    return getUsersRankList;
  }

  async getUserNickname(userId: number): Promise<void | UserDto> {
    const getUserNickname = await prisma.user.findUnique({
      where: { id: userId },
    });
  }

  /**
   * 현재 유저 랭킹을 출력
   */
  //todo 왠만하면 ORM 쿼리 사용
  async getCurrentUserRank(req: Request, res: Response) {
    const getRankList = await prisma.$queryRaw`
    SELECT userId, score, rankDate From Rank`;
    return getRankList;
  }

  /**유저가 조회한 시점으로 해당 유저의 index값 저장 */
  async postUserRankIndex() {
    const userRanking = await prisma.$queryRaw`
    INSERT INTO User VALUE ()`;
    return userRanking;
    //인덱스 값을 저장
  }

  /** 유저가 /rank접속시 이전 랭킹과 현재 접속한 랭킹 차와 현재랭킹값 구하기 */
  async postPastUserRank() {
    const currentRank = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        score: true,
        user: {
          select: { nickname: true },
        },
      },
      // 여기서 현재 랭킹, 이전 랭킹, 랭킹 차 가져오기
    });
    const previousRank = await prisma.PastRank.findUnique({
      id: number,
    });

    const rankingChange = previousRank - currentRank;

    return {
      currentRank,
      rankingChange,
    };
  }

  async getUserGapRank() {
    const gapRank = await prisma;
    return gapRank;
  }

  /** 모든 유저의 score를 0으로 업데이트 */
  //todo 이건 아마 주마다 랭킹초기화를 위한거 같은데 클라이언트 요청이 아니라 서버사이드에서 스케쥴러로 만들어줘야합니다.
  async resetUserScores() {
    try {
      const updatedUsers = await prisma.user.updateMany({
        rank: {
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
