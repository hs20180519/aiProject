import passport from "passport";
import generateJwt from "../utils/generateJwt";
import { NextFunction, Request, Response } from "express";
import { User } from "@prisma/client";

/** @description local 전략을 사용해 사용자를 인증하고 세션 생성 및 JWT 토큰 발급 */
const passportLocal = (
  req: Request & {
    user?: User;
    token?: string;
    session?: any;
  },
  res: Response,
  next: NextFunction,
) => {
  passport.authenticate("local", { session: true }, (error: Error, user: User, info: any) => {
    if (error) {
      console.error(error);
      return next(error);
    }
    if (!user) {
      return res.status(400).json({ message: "유효하지 않은 사용자 입니다." });
    }
    const secretKey = process.env.JWT_SECRET_KEY!;
    const tokenExpires = process.env.JWT_TOKEN_EXPIRES!;
    const token = generateJwt(
      {
        id: user.id,
        name: user.name,
        nickname: user.nickname,
        email: user.email,
      },
      secretKey,
      tokenExpires,
    );
    req.session.user = user;

    req.user = req.session.user;
    req.token = token;
    next();
  })(req, res, next);
};

export default (req: Request, res: Response, next: NextFunction) => {
  passportLocal(
    req as Request & {
      user?: User;
      token?: string;
    },
    res,
    next,
  );
};
