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

// 잘 쓸 수 있을 지 의문..
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
