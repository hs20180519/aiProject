import { kakaoService } from "../services/kakaoService";
import { Request, Response, NextFunction } from "express";
import * as OAuthService from "../services/oAuthService";
import { PrismaClient } from "@prisma/client";
import generateJwt from "../utils/generateJwt";

const secretKey = process.env.JWT_SECRET_KEY!;
const tokenExpires = process.env.JWT_TOKEN_EXPIRES!;

const prisma = new PrismaClient();

/**
 * 프론트에서 카카오톡 로그인 버튼을 클릭 시 동의하기 팝업을 리다이렉션 시켜줍니다.
 */
export const kakaoCallback = async (req: Request, res: Response, next: NextFunction) => {
  const url = kakaoService.getAuthCodeURL();
  res.status(302).redirect(url);
};

export const kakaoLogin = async (req: Request, res: Response, next: NextFunction) => {
  const code = req.body.code;
  if (!code) {
    throw new Error("카카오톡 코드가 전송되지 않았습니다.");
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

  // 유저를 찾지 못했을 시 카카오톡 기본 정보로 회원가입 후 나머지 입력정보 받을 수 있게 프론트 회원가입 페이지로 리다이렉션.
  // -> 라고 야심차게 했지만 리다이렉션 안됨.. 그냥 내정보에서 추가정보 입력
  if (!findUser) {
    const { nickname, email, picture } = kakaoUserProfile;
    await OAuthService.createKakaoUser(kakaoUserProfile);

    // let queryString = `nickname=${nickname}`;
    // queryString += email ? `&email=${email}` : "";
    // queryString += picture ? `&picture=${picture}` : "";
    // console.log("-------리다이렉션 시켜버리기!!!!!!!!!!!----------");
    // res.status(302).redirect(`http://localhost:3000/signup?${queryString}`);
  }

  // 유저를 찾았을 시 액세스 토큰 발급
  else {
    const access_token = generateJwt(
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
};
