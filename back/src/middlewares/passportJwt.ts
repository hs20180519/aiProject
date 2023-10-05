import passport from "passport";
import { NextFunction, Request, Response } from "express";

interface User {
  id: string;
  email: string | null;
  name: string | null;
  nickname: string | null;
  password: string | null;
  profileImageUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
  manager: boolean;
}

/** @description jwt전략
 * 요청의 token 을 디코드하여 해당 세션을 찾아냅니다.
 * req 객체의 user프로퍼티를 생성해 user데이터를 담아 넘겨줍니다. */
const passportJwt = (req: Request & { session: any }, res: Response, next: NextFunction) => {
  passport.authenticate("jwt", { session: true }, (error: Error | null, user: User) => {
    if (error) {
      console.error(error);
      return next(error);
    }
    if (!user) {
      return res.status(401).json({ message: "로그인 상태가 아닙니다." });
    }
    req.session.user = user;
    req.user = req.session.user;
    next();
  })(req, res, next);
};

export default passportJwt;
