import Joi from "joi";
import { Request, Response, NextFunction } from "express";

export const validateGetWords = (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
    correct: Joi.boolean().optional(),
    incorrect: Joi.boolean().optional(),
    csat: Joi.boolean().optional(),
    toeic: Joi.boolean().optional(),
    toefl: Joi.boolean().optional(),
    ielts: Joi.boolean().optional(),
    custom: Joi.boolean().optional(),
    customBookId: Joi.string().optional(),
  });

  const { error } = schema.validate(req.query);
  if (error) return res.status(400).json({ message: "잘못된 요청입니다." });

  next();
};

export const validateSaveLearn = (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
    wordId: Joi.number().required(),
    correct: Joi.boolean().required(),
  });

  const { error } = schema.validate(req.body);
  if (error) return res.status(400).json({ message: "잘못된 요청입니다." });

  next();
};
