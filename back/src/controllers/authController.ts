import bcrypt from "bcrypt";
import { Request, Response, NextFunction } from "express";
import * as authService from "../services/authService";
import * as authInterface from "../interfaces/authInterface";
import { User, VerifiCode } from "@prisma/client";
import { UserDto } from "../dtos/userDto";

export const checkEmail = async (req: Request, res: Response, next: NextFunction) => {
  /**
   * #swagger.tags = ['Auth']
   * #swagger.summary = '[회원가입 요청 전] 이메일 중복 체크 ?email=...'
   */
  try {
    const email: string = req.query.email as string;
    if (email) {
      const existingUserEmail: User | null = await authService.getUserByEmail(email);
      if (existingUserEmail)
        return res.status(409).json({ message: "이미 사용중인 이메일 입니다." });
      else return res.status(200).json({ message: "사용 가능한 이메일 입니다." });
    }
  } catch (error) {
    console.error(error);
    return next(error);
  }
};

export const register = async (req: Request, res: Response, next: NextFunction) => {
  /**
   * #swagger.tags = ['Auth']
   * #swagger.summary = '이메일 인증'
   * #swagger.description = '[회원가입 요청 전] 사용자 이메일로 인증코드 전송'
   */
  try {
    const email = req.body.email;
    const existingCode: VerifiCode | null = await authService.getVerifyCodeByEmail(email);
    if (!existingCode) await authService.sendVerificationCode(email);
    else await authService.resendVerificationCode(email);
    return res.status(200).json({ message: "인증코드가 전송되었습니다." });
  } catch (error) {
    console.error(error);
    return next(error);
  }
};

export const verify = async (req: Request, res: Response, next: NextFunction) => {
  /**
   * #swagger.tags = ['Auth']
   * #swagger.summary = '이메일 인증 코드 확인'
   * #swagger.description = '[회원가입 요청 전] 사용자가 입력한 인증코드가 일치하는지 확인.'
   */
  try {
    const { email, code } = req.body;
    const isVerified: boolean = await authService.verifyEmail(email, code);

    if (!isVerified) return res.status(400).json({ message: "인증코드가 일치하지 않습니다." });

    return res.status(200).json({ message: "인증되었습니다." });
  } catch (error) {
    console.error(error);
    return next(error);
  }
};

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  /**
   * #swagger.tags = ['Auth']
   * #swagger.summary = '회원가입'
   */
  try {
    const { email, password, name, nickname } = req.body;
    const emailExists: User | null = await authService.signUpDuplicateCheck(email);

    if (emailExists) return res.status(409).json({ message: "이미 존재하는 이메일입니다." });

    const hashedPassword: string = await bcrypt.hash(password, 10);
    const newUser: UserDto = await authService.createUser({
      email,
      name,
      nickname,
      password: hashedPassword,
    });

    return res.status(201).json({
      message: `회원가입에 성공했습니다 :: ${newUser.email}`,
    });
  } catch (error) {
    console.error(error);
    return next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    /**
     * #swagger.tags = ['Auth']
     * #swagger.summary = '로그인'
     * #swagger.description = '로컬 로그인. 로그인 성공 시 JWT 발급'
     */
    const authReq = req as authInterface.AuthenticatedRequest;
    if (!authReq.user) return res.status(401).json({ message: "유효하지 않은 사용자 정보입니다." });
    const loginUser = {
      token: authReq.token, // todo postman 편의성을 위해 추가. 개발 종료시점에서 삭제
      user: authReq.user.name,
      nickname: authReq.user.nickname,
      profileImage: authReq.user.profileImage,
    };
    return res.cookie("token", authReq.token).status(200).json(loginUser);
  } catch (error) {
    console.error(error);
    return next(error);
  }
};

export const editUser = async (req: Request, res: Response, next: NextFunction) => {
  /**
   * #swagger.tags = ['Auth']
   * #swagger.summary = '유저 업데이트'
   * #swagger.description = '회원 정보 수정. 요청 받은 필드만 수정. 이메일은 변경하려면 인증을 추가해야할듯. 지금은 이름, 별명, 프로필 이미지정도. 비밀번호 변경도 따로해야하나? 일단 빼둡니다'
   * #swagger.security = [{
   *   "bearerAuth": []
   * }]
   */
  try {
    const userId: number = (req.user as User).id;
    const updatedData = req.body;
    const updatedUser: UserDto = await authService.editUser(userId, updatedData);
    return res.status(200).json(updatedUser);
  } catch (error) {
    console.error(error);
    return next(error);
  }
};

export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  /**
   * #swagger.tags = ['Auth']
   * #swagger.summary = '회원탈퇴'
   * #swagger.description = '관계 데이터 삭제 후 유저 삭제'
   * #swagger.security = [{
   *   "bearerAuth": []
   * }]
   */
  try {
    const userId: number = (req.user as User).id;
    const deletedUser: UserDto | null = await authService.deleteUser(userId);
    req.session.destroy((error: Error | null) => {
      if (error) {
        console.error(error);
        return next(error);
      }
      res.clearCookie("token");
      return res.status(200).json({ message: `회원탈퇴 ${deletedUser!.email}` });
    });
  } catch (error) {
    console.error(error);
    return next(error);
  }
};
