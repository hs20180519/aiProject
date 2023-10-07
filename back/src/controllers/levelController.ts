import { Request, Response, NextFunction } from "express";
import * as levelService from "../services/levelService";

export const getTestWords = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const words = await levelService.getTestWords();
    return res.status(200).json(words);
  } catch (error) {
    console.error(error);
    return next(error);
  }
};
