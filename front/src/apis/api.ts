/* eslint-disable */
import axios from "axios";

export const serverUrl = `${process.env.REACT_APP_SERVER_URL_API}`;

async function get(endpoint: string) {
  const token = sessionStorage.getItem("userToken");
  const url = `${serverUrl + endpoint}`;
  const res = await axios.get(url, {
    // JWT 토큰을 헤더에 담아 백엔드 서버에 보냄.
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res;
}

async function getExperience(endpoint: string) {
  const url = `${serverUrl + endpoint}`;
  const res = await axios.get(url);
  return res;
}

async function post(endpoint: string, data: any) {
  // JSON.stringify 함수: Javascript 객체를 JSON 형태로 변환함.
  const bodyData = JSON.stringify(data);

  return axios.post(serverUrl + endpoint, bodyData, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${sessionStorage.getItem("userToken")}`,
    },
  });
}

async function postQuery<T>(endpoint: string, data: T) {
  const queryParams = new URLSearchParams();

  for (const key in data) {
    if (data[key] !== undefined) {
      queryParams.append(key, String(data[key]));
    }
  }

  const queryString = queryParams.toString();
  const urlWithQueryString = serverUrl + endpoint + "?" + queryString;

  return axios.post(urlWithQueryString, null, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Bearer ${sessionStorage.getItem("userToken")}`,
    },
  });
}

async function put<T>(endpoint: string, data: T) {
  // JSON.stringify 함수: Javascript 객체를 JSON 형태로 변환함.
  const bodyData = JSON.stringify(data);

  return axios.put(serverUrl + endpoint, bodyData, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${sessionStorage.getItem("userToken")}`,
    },
  });
}

async function sendImage(method: "post" | "put", endpoint: string, formData: FormData) {
  return axios[method](serverUrl + endpoint, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${sessionStorage.getItem("userToken")}`,
    },
  });
}

// 아래 함수명에 관해, delete 단어는 자바스크립트의 reserved 단어이기에,
// 여기서는 우선 delete 대신 del로 쓰고 아래 export 시에 delete로 alias 함.
async function del(endpoint: string) {
  return axios.delete(`${serverUrl + endpoint}`, {
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem("userToken")}`,
    },
  });
}

// 아래처럼 export한 후, import * as A 방식으로 가져오면,
// A.get, A.post 로 쓸 수 있음.
export { get, getExperience, post, postQuery, put, del as delete, sendImage };
