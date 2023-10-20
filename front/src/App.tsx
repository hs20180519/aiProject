import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";
import React, { useReducer, useEffect, useState, createContext } from "react";
import InrtoPage from "./pages/IntroPage";
import MainPage from "./pages/MainPage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage/SignUpPage";
import KakaoTestPage from "./pages/KakaoTestPage";
import OAuthPage from "./pages/OAuthPage";
import SignUpPage2 from "./pages/SignUpPage/SignUpPage2";
import * as Api from "./apis/api";
import { loginReducer, DispatchEvent, UserState } from "./reducer";

export const DispatchContext = createContext<DispatchEvent | null>(null);
export const UserStateContext = createContext<UserState | null>(null);

function App() {
  // useReducer 훅을 통해 userState 상태와 dispatch함수를 생성함.
  const [userState, dispatch] = useReducer(loginReducer, {
    user: null,
  });

  // 아래의 fetchCurrentUser 함수가 실행된 다음에 컴포넌트가 구현되도록 함.
  // 아래 코드를 보면 isFetchCompleted 가 true여야 컴포넌트가 구현됨.
  const [isFetchCompleted, setIsFetchCompleted] = useState(false);

  const fetchCurrentUser = async () => {
    try {
      // 이전에 발급받은 토큰이 있다면, 이를 가지고 유저 정보를 받아옴.
      const res = await Api.get("user");
      const currentUser = res.data;

      // dispatch 함수를 통해 로그인 성공 상태로 만듦.
      dispatch({
        type: "LOGIN_SUCCESS",
        payload: currentUser,
      });

      console.log("%c sessionStorage에 토큰 있음.", "color: #d93d1a;");
    } catch {
      console.log("%c SessionStorage에 토큰 없음.", "color: #d93d1a;");
    }
    // fetchCurrentUser 과정이 끝났으므로, isFetchCompleted 상태를 true로 바꿔줌
    setIsFetchCompleted(true);
  };

  // useEffect함수를 통해 fetchCurrentUser 함수를 실행함.
  useEffect(() => {
    fetchCurrentUser();
  }, []);

  if (!isFetchCompleted) {
    return <>{"loading..."}</>;
  }
  return (
    <DispatchContext.Provider value={dispatch}>
      <UserStateContext.Provider value={userState}>
        <div className={"App"}>
          <ChakraProvider>
            <BrowserRouter>
              <Routes>
                <Route path={"/"} element={<InrtoPage />} />
                <Route path={"/main"} element={<MainPage />} />
                <Route path={"/login"} element={<LoginPage />} />
                <Route path={"/signup"} element={<SignUpPage />} />
                <Route path={"/kakao"} element={<KakaoTestPage />} />
                <Route path={"/oauth/kakao"} element={<OAuthPage />} />
                <Route path={"/signup2"} element={<SignUpPage2 />} />
              </Routes>
            </BrowserRouter>
          </ChakraProvider>
        </div>
      </UserStateContext.Provider>
    </DispatchContext.Provider>
  );
}

export default App;
