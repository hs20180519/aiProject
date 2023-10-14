import axios from "axios";
// import { PrismaClient } from "@prisma/client";

// const prisma = new PrismaClient();

class Kakao {
  key: string;
  redirectUri: string;
  constructor() {
    this.key = process.env.KAKAO_ID!;
    this.redirectUri = process.env.REDIRECT_URI!;
  }

  /**
   * @description 카카오 인가코드를 받기위한 URL 가져오기
   */
  getAuthCodeURL() {
    return `https://kauth.kakao.com/oauth/authorize?client_id=${this.key}&redirect_uri=${this.redirectUri}&response_type=code`;
  }
  // https://kauth.kakao.com/oauth/authorize?client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=account_email

  /**
   * @description 토큰 발급하기
   * @param code 인가코드
   */
  async getToken(code: string) {
    const params = {
      client_id: this.key,
      code,
      grant_type: "authorization_code",
      redirect_uri: this.redirectUri,
    };

    const { data } = await axios.post("https://kauth.kakao.com/oauth/token", params, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    const tokenData = {
      access_token: data.access_token,
      refresh_token: data.refresh_token,
    };

    return tokenData;
  }

  async getLogout() {}

  async getLogin(token: JSON) {
    const { data } = await axios.post(
      `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${this.key}&redirect_uri=${this.redirectUri}&prompt=login`,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      },
    );
  }

  /**
   * @description 유저 정보 가져오기
   * @param token 액세스 토큰
   */
  async getUserData(token: JSON) {
    const { data } = await axios.get("https://kapi.kakao.com/v2/user/me", {
      headers: {
        Authorization: `Bearer ${token}`,
        ContentType: `application/x-www-form-urlencoded;charset=utf-8`,
      },
    });
    // const url = `https://kauth.kakao.com/oauth/authorize?client_id=${this.key}&redirect_uri=${this.redirectUri}&response_type=code&scope=account_email,gender`;
    const userData = {
      nickname: data.kakao_account.profile.nickname,
      name: data.kakao_account.name,
      email: data.kakao_account.profile.email,
      picture: data.kakao_account.profile.profile_image,
    };

    return userData;
  }

  /** 유저 정보 조회 */
  async getUserInfo(token: JSON) {
    const { data } = await axios.get("https://kapi.kakao.com/v1/oidc/userinfo", {
      headers: {
        Authorization: `Bearer ${token}`,
        ContentType: `application/x-www-form-urlencoded;charset=utf-8`,
      },
    });
    const userInfo = {
      userNumber: data.sub,
      nickname: data.nickname,
      name: data.name,
      email: data.email,
      email_verified: data.email_verified,
    };
  }
}

export const KakaoClient = new Kakao();
