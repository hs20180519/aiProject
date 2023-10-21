/* eslint-disable */
import { AxiosInstance, AxiosRequestHeaders } from "axios";
import customAxiosInstance from "./instance";

export const instance = customAxiosInstance();

export interface IRequestProps {
  instance?: AxiosInstance;
  url: string;
  headers: AxiosRequestHeaders;
  method: "get" | "post" | "put" | "patch" | "delete";
  query?: Record<string, unknown>;
  data?: unknown;
}

/** api2 -> api로 변경 작업 중 ,임시 GPT API로 사용중 테스트 후 해당 파일 삭제 예정 */ 
export const API = async (props: IRequestProps) => {
  const { method, url, data, headers } = props;

  try {
    switch (method) {
      case "get":
        return await instance.get(url, { headers });
      case "post":
        return await instance.post(url, data, { headers });
      case "put":
        return await instance.put(url, data, { headers });
      case "patch":
        return await instance.patch(url, data, { headers });
      case "delete":
        return await instance.delete(url, { headers });
      default:
    }
  } catch (e: any) {
    return e;
  }
};
