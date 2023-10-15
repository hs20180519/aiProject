import axios from "axios";

export const OAuthKakaoLogin = async () => {
  const url = `http://localhost:8000/auth/kakao`;
  const res = await axios.get(url);
  return res;
};

export const OAuthKakaoLoginWithSnsId = async (snsId: string) => {
  const url = `http://localhost:8000/auth/kakao`;
  const data = {
    snsId,
    password: "empty value",
  };
  const res = await axios.post(url, data, {});
  console.log(res);
  return res;
};
