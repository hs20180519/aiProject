import Joi from "joi";
import { NextFunction, Request, Response } from "express";
import { validatorQuerySchema } from "./validatorQuerySchema";

export const validateSaveLearn = (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
    wordId: Joi.number().required(),
    correct: Joi.boolean().required(),
  });

  const { error } = schema.validate(req.body);
  if (error) return res.status(400).json({ validator: "잘못된 요청입니다." });

  next();
};
