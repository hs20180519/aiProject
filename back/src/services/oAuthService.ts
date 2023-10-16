import { KakaoAuthToken, kakaoService, KakaoProfile } from "../services/kakaoService";
import { PrismaClient, User } from "@prisma/client";
import generateJwt from "../utils/generateJwt";

const prisma = new PrismaClient();

export const getKakaoToken = async (code: string): Promise<KakaoAuthToken> => {
  const kakaoAuthToken = await kakaoService.getToken(code);
  if (!kakaoAuthToken) {
    throw new Error("카카오 토큰을 받아오는 중 오류가 발생했습니다.");
  }
  return kakaoAuthToken;
};

export const getKakaoProfile = async (access_token: string) => {
  const kakaoUserProfile = await kakaoService.getUserProfile(access_token);
  if (!kakaoUserProfile.snsId) {
    throw new Error("카카오 프로필을 불러오는 도중 에러가 발생했습니다.");
  }
  return kakaoUserProfile;
};

export const createKakaoUser = async (kakaoProfile: KakaoProfile): Promise<User> => {
  const { nickname, email, picture, snsId } = kakaoProfile;

  const newUser = await prisma.user.create({
    data: {
      snsId,
      nickname,
      email,
      profileImage: picture,
    },
  });
  return newUser;
};

export const kakaoJWT = async (user: User) => {
  const secretKey = process.env.JWT_SECRET_KEY!;
  const tokenExpires = process.env.JWT_TOKEN_EXPIRES!;
  const access_token = generateJwt(
    {
      id: user.id,
      name: user.name,
      nickname: user.nickname,
      email: user.email,
    },
    secretKey,
    tokenExpires,
  );
  return access_token;
};
