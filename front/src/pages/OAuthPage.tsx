/* eslint-disable */
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState, useReducer } from "react";
import { fetchKakaoOAuthLogin } from "../apis/social";
import * as Api from "../apis/api";
import { loginReducer } from "../reducer";

export default function OAuthPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [kakaoCode, setKakaoCode] = useState("");
  // useReducer 훅을 통해 userState 상태와 dispatch함수를 생성함.
  const [, dispatch] = useReducer(loginReducer, {
    user: null,
  });

  const fetchKakaoLogin = async () => {
    try {
      const res = await fetchKakaoOAuthLogin(kakaoCode);

      if (res.status !== 200) {
        alert("로그인 실패");
        // navigate("/");
        return;
      }
      sessionStorage.setItem("userToken", res.data.access_token);
      await fetchCurrentUser();
      navigate("/main");
    } catch (e) {
      console.log(e);
    }
  };

  const fetchCurrentUser = async () => {
    try {
      const res = await Api.get("/user");
      const currentUser = res.data;
      console.log(currentUser);
      dispatch({
        type: "LOGIN_SUCCESS",
        payload: currentUser,
      });

      console.log("%c sessionStorage에 토큰 있음.", "color: #d93d1a;");
    } catch {
      console.log("%c SessionStorage에 토큰 없음.", "color: #d93d1a;");
    }
  };

  useEffect(() => {
    const value = searchParams.get("code");
    if (value) {
      setKakaoCode(value);
    }
  }, [location]);

  useEffect(() => {
    if (kakaoCode !== "") {
      fetchKakaoLogin();
    }
  }, [kakaoCode]);

  return <>카카오 로그인 페이지입니다.</>;
}
