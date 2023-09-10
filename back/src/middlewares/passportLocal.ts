import passport from "passport";
import generateJwt from "../utils/generateJwt";
import { Request, Response, NextFunction } from "express";
import { User } from "@prisma/client";

/** @description local 전략을 사용해 사용자를 인증하고 JWT 토큰 발급 */
const passportLocal = (
    req: Request & {
        user?: User;
        token?: string;
    },
    res: Response,
    next: NextFunction,
) => {
    passport.authenticate(
        "local",
        { session: false },
        (error: Error, user: User, info: any) => {
            if (error) {
                console.error(error);
                return next(error);
            }
            if (!user) {
                return res
                    .status(401)
                    .json({ message: "유효하지 않은 사용자 정보입니다." });
            }
            const secretKey = process.env.JWT_SECRET_KEY!;
            const tokenExpires = process.env.JWT_TOKEN_EXPIRES!;
            const token = generateJwt(
                {
                    id: user.id,
                    name: user.name,
                    nickname: user.nickname,
                    email: user.email,
                    manager: user.manager,
                },
                secretKey,
                tokenExpires,
            );

            req.user = user;
            req.token = token;
            next();
        },
    )(req, res, next);
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
