import axios from "axios";

export const fetchKakaoOAuthLogin = async (code: string) => {
  const url = `${process.env.REACT_APP_SERVER_URL_API}/oauth/kakao`;

  const data = {
    code,
  };
  const res = await axios.post(url, data, {});
  return res;
};
