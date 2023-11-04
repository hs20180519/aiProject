import { kakaoService } from "../services/kakaoService";
import { Request, Response, NextFunction } from "express";
import * as OAuthService from "../services/oAuthService";
import { PrismaClient, User } from "@prisma/client";
import generateJwt from "../utils/generateJwt";

const secretKey: string = process.env.JWT_SECRET_KEY!;
const tokenExpires: string = process.env.JWT_TOKEN_EXPIRES!;

const prisma = new PrismaClient();

/**
 * #swagger.tags = ['Kakao']
 * #swagger.summary = '카카오 동의 팝업창'
 * #swagger.description = '카카오톡 로그인 버튼을 클릭 시 동의하기 팝업을 리다이렉션'
 * }]
 */
export const kakaoCallback = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const url: string = kakaoService.getAuthCodeURL();
    res.status(302).redirect(url);
  } catch (error) {
    console.error(error);
    return next(error);
  }
};

export const kakaoLogin = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const code = req.body.code;

    const { access_token } = await OAuthService.getKakaoToken(code);
    const kakaoUserProfile = await OAuthService.getKakaoProfile(access_token);

    const findUser: User | null = await prisma.user.findUnique({
      where: {
        snsId: kakaoUserProfile.snsId.toString(),
      },
    });

    if (!findUser) await OAuthService.createKakaoUser(kakaoUserProfile);
    // 기존 카카오 로근 유저라면
    else {
      const access_token: string = generateJwt(
        {
          id: findUser.id,
          name: findUser.name,
          nickname: findUser.nickname,
          email: findUser.email,
        },
        secretKey,
        tokenExpires,
      );
      res.status(200).json({ access_token });
    }
  } catch (error) {
    console.error(error);
    return next(error);
  }
};
