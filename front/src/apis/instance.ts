/* eslint-disable */
import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

const baseURL = process.env.GPT_SERVER_URL;

/** api 파일 연결 테스트 후 해당 파일 삭제 예정 */
const customAxiosInstance = () => {
  const axiosInstance = axios.create({
    baseURL,
    headers: { "Content-Type": "application/json" },
  });
  // HTTP 상태코드가 2xx대일 때 처리하고 싶은 로직
  const onFulfilled = (res: any) => {
    return res;
  };

  // response 에러가 있을 시
  const onRejected = async (e: AxiosError) => {
    const { config } = e;
    // const originalRequset = config;
    return Promise.reject(e);
  };

  // request 전 수행할 일
  // 로컬스토리지에 넣을지 세션스토리지에 넣을지 정해야함. -> 아마 세션 스토리지에 넣지 않을까요?
  const requestPrev = async (config: InternalAxiosRequestConfig) => {
    const accessToken = localStorage.getItem("access_token");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  };

  const requestError = (e: any) => Promise.reject(e);

  axiosInstance.interceptors.request.use(requestPrev, requestError);
  axiosInstance.interceptors.response.use(onFulfilled, onRejected);
  return axiosInstance;
};

export default customAxiosInstance;
