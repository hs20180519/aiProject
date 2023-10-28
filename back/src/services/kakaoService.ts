import axios from "axios";

import { KakaoAuthToken } from "../interfaces/kakaoInterface";

class KakaoService {
  key: string;
  redirectUri: string;
  constructor() {
    this.key = process.env.KAKAO_ID!;
    this.redirectUri = "http://localhost:3000/oauth/kakao";
  }

  /**
   * @description 카카오 인가코드를 받기위한 URL 가져오기
   */
  getAuthCodeURL(): string {
    return `https://kauth.kakao.com/oauth/authorize?client_id=${this.key}&redirect_uri=${this.redirectUri}&response_type=code`;
  }

  /**
   * @description 프론트에서 쿼리로 받은 코드를가지고 액세스토큰, 리프레쉬토큰을 발급합니다.
   * @param code 인가코드
   */
  async getToken(code: string): Promise<KakaoAuthToken> {
    const params = {
      client_id: this.key,
      code,
      grant_type: "authorization_code",
      redirect_uri: this.redirectUri,
    };

    const configs = {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    };

    const { data } = await axios.post("https://kauth.kakao.com/oauth/token", params, configs);

    return {
      access_token: data.access_token,
      refresh_token: data.refresh_token,
    };
  }

  /**
   * @description 발급 받은 액세스 토큰으로 유저 정보를 가져옵니다.
   * @param access_token 액세스 토큰
   */
  async getUserProfile(access_token: string): Promise<any> {
    try {
      const url = "https://kapi.kakao.com/v2/user/me";
      const configs = {
        headers: {
          Authorization: `Bearer ${access_token}`,
          ContentType: `application/x-www-form-urlencoded;charset=utf-8`,
        },
      };
      const { data } = await axios.get(url, configs);
      console.log(data);

      return {
        snsId: data.id.toString(),
        nickname: data.kakao_account.profile.nickname,
        email: data.kakao_account.email,
        picture: data.kakao_account.profile.profile_image_url,
      };
    } catch (e) {
      console.log(e);
    }
  }
}

export const kakaoService: KakaoService = new KakaoService();
