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
