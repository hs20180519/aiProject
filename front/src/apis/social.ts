import axios from "axios";

export const fetchKakaoOAuthLogin = async (code: string) => {
  const url = `http://localhost:8000/oauth/kakao`;
  const data = {
    code,
  };
  const res = await axios.post(url, data, {});
  return res;
};
