import axios from "axios";

// todo interface 경로 수정
export interface KakaoAuthToken {
  access_token: string;
  refresh_token: string;
}

export interface KakaoProfile {
  snsId: string;
  nickname: string;
  picture?: string | undefined;
  email?: string | undefined;
}

class Kakao {
  key: string;
  redirectUri: string;
  constructor() {
    this.key = process.env.KAKAO_ID!;
    this.redirectUri = "http://localhost:8000/auth/kakao/callback";
  }

  /**
   * @description 카카오 인가코드를 받기위한 URL 가져오기
   */
  getAuthCodeURL() {
    return `https://kauth.kakao.com/oauth/authorize?client_id=${this.key}&redirect_uri=${this.redirectUri}&response_type=code`;
  }

  /**
   * @description 토큰 발급하기
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

    const kakaoToken: KakaoAuthToken = {
      access_token: data.access_token,
      refresh_token: data.refresh_token,
    };

    return kakaoToken;
  }

  /**
   * @description 유저 정보 가져오기
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

      const kakaoProfile: KakaoProfile = {
        snsId: data.id.toString(),
        nickname: data.kakao_account.profile.nickname,
        email: data.kakao_account.email,
        picture: data.kakao_account.profile.profile_image_url,
      };

      return kakaoProfile;
    } catch (e) {
      console.log(e);
    }
  }
}

export const KakaoClient = new Kakao();
