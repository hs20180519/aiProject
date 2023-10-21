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

export const getUserRank = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId: number = (req.user as User).id;
    const rank: number = await rankService.getUserRank(userId);
    if (!rank) return res.status(400).json({ message: "유저의 랭킹을 가져올 수 없습니다." });

    return res.status(200).json(rank);
  } catch (e) {
    console.error(e);
    return next(e);
  }
};

// export const updateUserRank = async (req Request, res: Response, next: NextFunction) => {
//   try {
//     const updateUserRank6pm = await rankService.updateUserRank6pm;
//     const updateUserRank8am = await rankService.updateUserRank8am;

//     res.status(200).json(updateUserRank6pm,updateUserRank8am);
//     console.log(updateUserRank6pm,updateUserRank8am);
//   } catch (e) {
//     res.status(400).json(`${e}\n 랭킹을 불러올 수 없습니다.`);
//     next(e);}}

/** 유저 랭킹 변화 */
export const getUserGapRank = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId: number = (req.user as User).id;
    const userGapRank = await rankService.userGapRank(userId);

    if (!userGapRank)
      return res.status(400).json({ message: `유저 랭킹변화를 조회 할 수 없습니다.` });
    return res.status(200).json(userGapRank);
  } catch (e) {
    console.error(e);
    return next(e);
  }
};
