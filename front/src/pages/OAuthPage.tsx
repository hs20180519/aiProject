import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState, useReducer, useContext } from "react";
import { fetchKakaoOAuthLogin } from "../apis/social";
import * as Api from "../apis/api";
import { loginReducer } from "../reducer";
import { Center, Flex, Spinner } from "@chakra-ui/react";
import { DispatchContext } from "../App";

export default function OAuthPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [kakaoCode, setKakaoCode] = useState("");
  const dispatch = useContext(DispatchContext);

  const fetchKakaoLogin = async () => {
    try {
      const res = await fetchKakaoOAuthLogin(kakaoCode);
      if (res.status !== 200) {
        alert("로그인 실패");
        navigate("/", { replace: true });
        return;
      }
      sessionStorage.setItem("userToken", res.data.access_token);
      await fetchCurrentUser();
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
      console.log("main으로 리다이렉트");
      console.log("%c sessionStorage에 토큰 있음.", "color: #d93d1a;");

      navigate("/main", { replace: true });
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

  return (
    <>
      <Flex>
        <Center w="100vw" h="100vh">
          <Spinner size="xl" color="cyan.500" />
        </Center>
      </Flex>
    </>
  );
}
