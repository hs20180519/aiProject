import passport from "passport";
import { Request, Response, NextFunction } from "express";

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
 * 요청의 token 을 디코드하여 분석한 뒤 인가를 결정합니다.
 * 인가가 끝난 다음 미들웨어로 req.user에 로그인한 유저의 정보를 담아서 내보내줌*/
const passportJwt = (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate(
        "jwt",
        { session: false },
        (error: Error | null, user: User, info?: any) => {
            if (error) {
                console.error(error);
                return next(error);
            }
            if (!user) {
                return res
                    .status(401)
                    .json({ message: "로그인 상태가 아닙니다." });
            }
            req.user = user;
            next();
        },
    )(req, res, next);
};

export default passportJwt;
