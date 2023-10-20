import { Request, Response } from "express";
import rank from "../services/rankService";
import { UserDto } from "../dtos/userDto";

export class rankController {
  async getUsersRankList() {

    try {
      const rankingChange = await rank.(userId);
      res.json(rankingChange);
    } catch (error) {
      console.error("랭킹을 불러올 수 없습니다.", error);
      res.status(500).json({ error: "랭킹 변화 조회 오류" });
    }
  }
  async getUserGapRank() {
    return await rank.getUserGapRank
  }
}

export const rank = new rankController();
