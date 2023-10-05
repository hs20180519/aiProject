import axios from "axios";

// [테스트] Mock API가 필요하다면 json-server를 사용합니다.
// 실행 명령어: $ npx json-server ./db.json --port 5001

// 이 주소는 dev 브랜치에 있는 로컬 백엔드 서버입니다.
// const backendPortNumber = "5001";
// const serverUrl = "http://" + window.location.hostname + ":" + backendPortNumber;

const backendPortNumber = "5002";
/** 이 주소는 VM에서 구동중인 백엔드 서버입니다.*/
const serverUrl = "http://34.64.160.14" + ":" + backendPortNumber;
// const serverUrl = "http://localhost" + ":" + backendPortNumber;
async function postData(data, endpoint, params = "", other = "") {
  // JSON.stringify 함수: Javascript 객체를 JSON 형태로 변환함.
  // 예시: {name: "Kim"} => {"name": "Kim"}
  console.log(`%cPOST 요청: ${serverUrl + endpoint + params + other}`, "color: #296aba;");
  console.log(`%cPOST 요청 데이터: ${data}`, "color: #296aba;");

  return axios.post(serverUrl + endpoint + params + other, data, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${sessionStorage.getItem("userToken")}`,
    },
  });
}

const getData = async (endpoint, params = "", other = "") => {
  console.log(`%cGET 요청: ${serverUrl + endpoint + params + other}`, "color: #a25cd1;");

  return axios.get(serverUrl + endpoint + params + other, {
    // JWT 토큰을 헤더에 담아 백엔드 서버에 보냄.
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem("userToken")}`,
    },
  });
};

async function putData(data, endpoint, params = "", other = "") {
  // JSON.stringify 함수: Javascript 객체를 JSON 형태로 변환함.
  // 예시: {name: "Kim"} => {"name": "Kim"}
  const bodyData = JSON.stringify(data);
  console.log(`%cPUT 요청: ${serverUrl + endpoint + params + other}`, "color: #059c4b;");
  console.log(`%cPUT 요청 데이터: ${bodyData}`, "color: #059c4b;");

  return axios.put(serverUrl + endpoint + params + other, bodyData, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${sessionStorage.getItem("userToken")}`,
    },
  });
}
async function putMulter(endpoint, formData) {
  return axios.put(serverUrl + endpoint, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${sessionStorage.getItem("userToken")}`,
    },
  });
}

// delete라는 문자열은 자바스크립트가 자체적으로 선점한(reserved) 키워드라서 변수명이나 함수명으로 사용할 수 없습니다.
async function deleteData(endpoint, params = "", other = "") {
  console.log(`DELETE 요청 ${serverUrl + endpoint + params + other}`);

  return axios.delete(serverUrl + endpoint + params + other, {
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem("userToken")}`,
    },
  });
}

// 아래처럼 export한 후, import * as A 방식으로 가져오면,
// A.get, A.post 로 쓸 수 있음.
export { getData, postData, putData, putMulter, deleteData };