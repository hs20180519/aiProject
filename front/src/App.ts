import { useReducer, useEffect } from "react";
import { Routes, Route } from "react-router-dom";

import * as Api from "./apis/api";

import "./index.css";

import LayoutPage from "./pages/LayoutPage";
import PoiPage from "./pages/PoiPage";
import WeatherPage from "./pages/WeatherPage";
import InfographicPage from "./pages/InfographicPage";
import MyPage from "./pages/MyPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import UnregisterPage from "./pages/UnregisterPage";

import userReducer from "./hooks/userReducer";

import UserStateContext from "./contexts/UserStateContext";
import DispatchContext from "./contexts/DispatchContext";

function App() {
  const [userState, dispatch] = useReducer(userReducer, {
    user: null,
  });

  /** 유저 정보를 받아오는 목업 API입니다.*/
  const fetchUserInfo = async () => {
    try {
      // 프론트엔드에서 보내주는 헤더에 있는 JWT 값으로 사용자를 판별합니다.
      const endpoint = "/user/mypage";
      const res = await Api.getData(endpoint);
      if (res.status === 200) {
        // dispatch 함수를 이용해 로그인 성공 신호와 사용자 정보를 상태값으로 저장합니다.
        dispatch({
          type: "LOGIN_SUCCESS",
          payload: res.data
        });
      }
    } catch (e) {
      console.log(e.response.data);
    }
  };

  useEffect(() => {
    console.log("--app mount--");
    const token = sessionStorage.getItem("userToken");
    if (token) {
      fetchUserInfo();
    }
  }, []);
  return (
    <div>
      <DispatchContext.Provider value={dispatch}>
        <UserStateContext.Provider value={userState}>
          <Routes>
            {/* 먼저 웹앱의 전체 레이아웃을 표시해야 하므로 루트 경로에다가 LayoutPage를 지정해주고, */}
            <Route path="/" element={<LayoutPage />}>
              {/* 접속 후 첫 화면에서 메인 기능을 Outlet 영역에 표시해 주기 위해서, Subroute로써 루트 경로에다가 PoiPage를 다시 한번 지정해줍니다. */}
              {/* 이렇게 해주면 사용자가 루트 경로로 접속을 할 때, LayoutPage와 함께 Outlet 영역에다가 메인 기능인 PoiPage를 한번에 같이 불러올 수 있습니다.*/}
              <Route path="/poi" element={<PoiPage />}></Route>
              <Route path="/weather" element={<WeatherPage />}></Route>
              <Route path="/infographic" element={<InfographicPage />}></Route>
              <Route path="/mypage" element={<MyPage />}></Route>
              <Route path="/login" element={<LoginPage />}></Route>
              <Route path="/register" element={<RegisterPage />}></Route>
              <Route path="/unregister" element={<UnregisterPage />}></Route>
            </Route>
          </Routes>
        </UserStateContext.Provider>
      </DispatchContext.Provider>
    </div>
  );
}

export default App;