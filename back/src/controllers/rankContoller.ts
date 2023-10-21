import { Request, Response, NextFunction } from "express";
import * as rankService from "../services/rankService";
import { User, Rank } from "@prisma/client";
import { UserDto } from "../dtos/userDto";

export const getUsersRankList = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const rankList = await rankService.getUsersRankList();
    res.status(200).json(rankList);
  } catch (e) {
    res.status(400).json(`${e}\n 유저 순위 목록을 가져올 수 없습니다.`);
    next(e);
  }
};

export const getUserRank = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user as User;
    const rank = await rankService.getUserRank(user);
  } catch (e) {
    res.status(400).json(`${e}\n 유저의 랭킹을 가져올 수 없습니다.`);
    next(e);
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
    const userGapRank = await rankService.userGapRank;
    res.status(200).json(userGapRank);
    console.log(userGapRank);
  } catch (e) {
    res.status(400).json(`${e}\n 유저 랭킹변화를 조회 할 수 없습니다.`);
    next(e);
  }
};
