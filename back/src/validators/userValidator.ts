import Joi from "joi";
import { Request, Response, NextFunction } from "express";
const namePattern = /^[a-zA-Z가-힣\s]+$/; // 한글, 영문 대소문자
const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/; // 이메일
const passwordPattern = /^[a-zA-Z0-9!@#$%^&*()-=_+[\]{}|;:',.<>/?]+$/; // 영문 대소문자, 숫자, 특수문자

export const validateCheckEmailOrNickname = (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
    email: Joi.string().email().regex(emailPattern).optional(),
    nickname: Joi.string().min(2).max(15).regex(namePattern).optional(),
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
    email: Joi.string().email().regex(emailPattern).required(),
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
    email: Joi.string().email().regex(emailPattern).required(),
    code: Joi.string().min(6).max(6).required(),
  });
  const { error } = schema.validate(req.body);
  if (error)
    return res.status(400).json({ message: "validator: 이메일 인증 전 유효성 검사 실패." });
  next();
};

export const validateCreateUser = (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
    email: Joi.string().email().regex(emailPattern).required(),
    name: Joi.string().min(2).max(30).regex(namePattern).required(),
    nickname: Joi.string().min(2).max(15).regex(namePattern).required(),
    password: Joi.string().min(4).max(50).regex(passwordPattern).required(),
  });
  const { error } = schema.validate(req.body);
  if (error) return res.status(400).json({ message: "validator: 회원가입 전 유효성 검사 실패." });
  next();
};

export const validateLogin = (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
    email: Joi.string().email().regex(emailPattern).required(),
    password: Joi.string().min(4).max(50).regex(passwordPattern).required(),
  });
  const { error } = schema.validate(req.body);
  if (error) return res.status(400).json({ message: "validator: 로그인 전 유효성 검사 실패." });
  next();
};

export const validateEditUser = (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(15).regex(namePattern).optional(),
    nickname: Joi.string().min(2).max(15).regex(namePattern).optional(),
    profileImage: Joi.any().optional(),
  });
  const { error } = schema.validate(req.body);
  if (error)
    return res.status(400).json({ message: "validator: 회원정보 수정 전 유효성 검사 실패." });
  next();
};
