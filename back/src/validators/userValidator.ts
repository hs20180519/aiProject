import Joi from "joi";
import { Request, Response, NextFunction } from "express";

export const validateCheckEmailOrNickname = (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
    email: Joi.string().email().optional(),
    nickname: Joi.string().min(2).max(15).optional(),
  });
  const { error } = schema.validate(req.query);
  if (error)
    return res
      .status(400)
      .json({ message: "validator: 이메일, 닉네임 중복 검사 전 유효성 검사 실패." });
  next();
};

export const validateRegister = (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
  });
  const { error } = schema.validate(req.body);
  if (error)
    return res
      .status(400)
      .json({ message: "validator: 이메일 인증 메일 발송 전 유효성 검사 실패." });
  next();
};

export const validateVerify = (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    code: Joi.string().min(6).max(6).required(),
  });
  const { error } = schema.validate(req.body);
  if (error)
    return res.status(400).json({ message: "validator: 이메일 인증 전 유효성 검사 실패." });
  next();
};

export const validateCreateUser = (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    name: Joi.string().min(2).max(30).required(),
    nickname: Joi.string().min(2).max(15).required(),
    password: Joi.string().min(4).max(50).required(),
  });
  const { error } = schema.validate(req.body);
  if (error) return res.status(400).json({ message: "validator: 회원가입 전 유효성 검사 실패." });
  next();
};

export const validateLogin = (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(4).max(50).required(),
  });
  const { error } = schema.validate(req.body);
  if (error) return res.status(400).json({ message: "validator: 로그인 전 유효성 검사 실패." });
  next();
};

export const validateEditUser = (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(15).optional(),
    nickname: Joi.string().min(2).max(15).optional(),
    profileImage: Joi.any().optional(),
  });
  const { error } = schema.validate(req.body);
  if (error)
    return res.status(400).json({ message: "validator: 회원정보 수정 전 유효성 검사 실패." });
  next();
};
