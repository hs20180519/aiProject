import { Request, Response, NextFunction } from "express";
import * as rankService from "../services/rankService";

//todo 코드 스타일을 통일하는게 좋지 않을까요? 함수 표현식으로 통일하거나 클래스를 이용한 정적메서드 방식으로 통일하거나
// (현재 서버 아키텍쳐가 함수표현식을 사용한다는 전제하에 구현한 상태이고 어차피 정적메서드를 사용한다면 굳이 클래스를 사용할 필요가 있을까요?)

export const getUsersRankList = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const rankList = await rankService.getUsersRankList;
    res.status(200).json(rankList);
    console.log(rankList);
  } catch (e) {
    res.status(400).json(`${e}\n 유저 순위 목록을 가져올 수 없습니다.`);
    next(e);
  }
  // 함수로 안넘겨주려면 어떻게 해야하지? 값을 넣으면 되는데 값 어떻게 넣더라
};

/** 유저 랭킹 변화 */
// export const getUserGapRank = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const userGapRank = await rankService.getUserGapRank;
//     res.status(200).json(userGapRank);
//     console.log(userGapRank);
//   } catch (e) {
//     res.status(400).json(`${e}\n 유저 순위 목록을 가져올 수 없습니다.`);
//     next(e);
//   }
// };
