import { KakaoClient } from "../passport/kakao";
import { Request, Response, NextFunction } from "express";
import * as OAuthService from "../services/oAuthService";
import { PrismaClient, User } from "@prisma/client";

const prisma = new PrismaClient();

export const kakaoLogin = async (req: Request, res: Response, next: NextFunction) => {
  // 카카오 로그인 처리
  const url = KakaoClient.getAuthCodeURL();
  res.status(302).redirect(url);
};

export const kakaoCallback = async (req: Request, res: Response, next: NextFunction) => {
  const code = req.query.code;
  if (typeof code !== "string") {
    throw new Error("카카오톡 코드를 받아오지 못했습니다.");
  }

  const { access_token, refresh_token } = await OAuthService.getKakaoToken(code);
  const kakaoUserProfile = await OAuthService.getKakaoProfile(access_token);

  if (!kakaoUserProfile.snsId) {
    throw new Error("카카오톡 회원 ID를 불러오는 도중 에러가 발생했습니다.");
  }

  const findUser = await prisma.user.findUnique({
    where: {
      snsId: kakaoUserProfile.snsId.toString(),
    },
  });

  if (!findUser) {
    const { nickname, email, picture } = kakaoUserProfile;
    let queryString = `nickname=${nickname}`;
    queryString += email ? `&email=${email}` : "";
    queryString += picture ? `&picture=${picture}` : "";
    await OAuthService.createKakaoUser(kakaoUserProfile);
    res.status(302).redirect(`http://localhost:3000/signup?${queryString}`);
  } else {
    res.redirect(`http://localhost:3000/oAuth?snsId=${findUser.snsId}`);
  }
};
