import { Request } from "express";
import { User, Rank } from "@prisma/client";

export interface UsersRank extends Request {
  user?: User;
  userId: number;
  rank: number;
  score: number;
}

export interface RankData extends Request {
  rank?: Rank;
  userId: number;
  score: number | 0;
  currentRank: number | null;
  lastRank: number | null;
}
