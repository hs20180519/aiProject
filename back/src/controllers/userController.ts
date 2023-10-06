import { NextFunction, Request, Response } from "express";
import { User } from "@prisma/client";
import * as userService from "../services/userService";

export const getProfile = async (req: Request, res: Response, next: NextFunction) => {
  /**
   * #swagger.tags = ['User']
   * #swagger.summary = '프로필'
   * #swagger.description = '유저 상세 정보'
   * #swagger.security = [{
   *   "bearerAuth": []
   * }]
   */
  try {
    const userId = (req.user as User).id;
    const user = await userService.getUserById(userId);
    return res.status(200).json(user);
  } catch (error) {
    console.error(error);
    next(error);
  }
};
