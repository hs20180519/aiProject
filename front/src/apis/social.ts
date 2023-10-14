import { instance } from "./api2";

export const OAuthKakaoLogin = async () => {
  const url = `/auth/kakao`;
  const res = await instance.get(url);
  return res;
};
