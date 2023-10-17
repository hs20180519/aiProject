import Joi from "joi";
import { NextFunction, Request, Response } from "express";
import { validatorQuerySchema } from "./validatorQuerySchema";

export const validateCreateBook = (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
    title: Joi.string().min(2).max(20).required(),
  });

  const { error } = schema.validate(req.body);
  if (error) return res.status(400).json({ validator: "잘못된 요청입니다." });

  next();
};

export const validateGetBook = async (req: Request, res: Response, next: NextFunction) => {
  const { error } = validatorQuerySchema.validate(req.query);
  if (error) return res.status(400).json({ validator: "잘못된 요청입니다." });

  next();
};

export const validateUpdateBook = (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
    query: Joi.object({
      customBookId: Joi.string().required(),
    }),
    body: Joi.object({
      title: Joi.string().min(2).max(20).required(),
    }),
  });

  const { error } = schema.validate({ query: req.query, body: req.body });
  if (error) return res.status(400).json({ validator: "잘못된 요청입니다." });

  next();
};

export const validateDeleteBook = (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
    customBookId: Joi.string().required(),
  });

  const { error } = schema.validate(req.query);
  if (error) return res.status(400).json({ validator: "잘못된 요청입니다." });

  next();
};

export const validateCreateWordInBook = (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
    query: Joi.object({
      customBookId: Joi.string().required(),
    }),
    body: Joi.object({
      word: Joi.string().min(1).max(30).required(),
      meaning: Joi.string().min(1).max(100).required(),
    }),
  });
  const { error } = schema.validate({ query: req.query, body: req.body });
  if (error) return res.status(400).json({ validator: "잘못된 요청입니다." });

  next();
};

export const validateUpdateWordInBook = (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
    query: Joi.object({
      customBookId: Joi.string().required(),
      wordId: Joi.string().required(),
    }),
    body: Joi.object({
      word: Joi.string().min(1).max(20).optional(),
      meaning: Joi.string().min(1).max(50).optional(),
    }),
  });

  const { error } = schema.validate({ query: req.query, body: req.body });
  if (error) return res.status(400).json({ validator: "잘못된 요청입니다." });

  next();
};

export const validateDeleteWordInBook = (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
    customBookId: Joi.string().required(),
    wordId: Joi.string().required(),
  });
  const { error } = schema.validate(req.query);
  if (error) return res.status(400).json({ validator: "잘못된 요청입니다." });

  next();
};
