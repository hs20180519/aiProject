import { Request, Response, NextFunction } from "express";
import * as rankService from "../services/rankService";
import { User } from "@prisma/client";
import { RankDto } from "../dtos/rankDto";

export const getUsersRankList = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page: number = req.query.page ? Number(req.query.page) : 1;
    const limit: number = req.query.page ? Number(req.query.limit) : 10;
    const rankList: RankDto[] = await rankService.getUsersRankList(page, limit);

    if (!rankList) res.status(400).json({ message: `유저 순위 목록을 가져올 수 없습니다.` });
    return res.status(200).json(rankList);
  } catch (e) {
    console.error(e);
    return next(e);
  }
};

export const getUsersRank = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const usersRank = await rankService.getUserRank();
    res.status(200).json(usersRank);
  } catch (e) {
    res.status(500).json({ message: `유저 랭킹 조회에 실패하였습니다.` });
    return next(e);
  }
};

// export const getRankGap = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     await rankService.getRankGap();
//     res.status(200).json({ message: "랭킹 차 조회를 완료하였습니다." });
//   } catch (e) {
//     res.status(500).json({ message: "랭킹 차 조회에 실패하였습니다." });
//     return next(e);
//   }
// };
