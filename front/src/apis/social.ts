import { instance } from "./api";

export const KaKaoLogin = async () => {
  const url = `/kakao`;
  const res = await instance.get(url);
  return res;
};
