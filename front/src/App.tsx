import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import React, { useReducer, createContext } from "react";
import IntroPage from "./pages/IntroPage";
import MainPage from "./pages/Main/MainPage";
import LoginPage from "./pages/Login/LoginPage";
import SignUpPage from "./pages/SignUpPage/SignUpPage";
import OAuthPage from "./pages/OAuthPage";
import ExperiencePage from "./pages/Experience/ExperiencePage";
import "./styles/app.css";

// import TestPage from "./pages/TestPage";
import { loginReducer, DispatchEvent, UserState } from "./reducer";

export const DispatchContext = createContext<DispatchEvent | null>(null);
export const UserStateContext = createContext<UserState | null>(null);

function App() {
  // useReducer 훅을 통해 userState 상태와 dispatch함수를 생성함.
  const [userState, dispatch] = useReducer(loginReducer, {
    user: null,
  });

  const color = {
    brand: {
      900: `#1a365d`,
      800: `#153e75`,
      700: `#2a69ac`,
    },
  };

  const theme = extendTheme({ color });

  return (
    <DispatchContext.Provider value={dispatch}>
      <UserStateContext.Provider value={userState}>
        <div className="App">
          <ChakraProvider theme={theme}>
            <BrowserRouter>
              <Routes>
                <Route path={"/"} element={<IntroPage />} />
                <Route path={"/main/*"} element={<MainPage />} />
                <Route path={"/login"} element={<LoginPage />} />
                <Route path={"/signup"} element={<SignUpPage />} />
                <Route path={"/oauth/kakao"} element={<OAuthPage />} />
                <Route path={"/test"} element={<ExperiencePage />} />
              </Routes>
            </BrowserRouter>
          </ChakraProvider>
        </div>
      </UserStateContext.Provider>
    </DispatchContext.Provider>
  );
}

export default App;