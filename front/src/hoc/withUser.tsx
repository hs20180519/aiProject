import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router";

import * as Api from "../apis/api";
import { DispatchContext } from "../App";

const withUser = (InnerComponent: React.FC) => {
  return () => {
    const navigate = useNavigate();
    const dispatch = useContext(DispatchContext);
    const [isFetchCompleted, setIsFetchCompleted] = useState(false);

    const fetchCurrentUser = async () => {
      try {
        console.log("-----로그인 요청----");
        // 이전에 발급받은 토큰이 있다면, 이를 가지고 유저 정보를 받아옴.
        const res = await Api.get("/user");
        const currentUser = res.data;

        // dispatch 함수를 통해 로그인 성공 상태로 만듦.
        dispatch({
          type: "LOGIN_SUCCESS",
          payload: currentUser,
        });

        console.log("%c sessionStorage에 토큰 있음.", "color: #d93d1a;");
        setIsFetchCompleted(true);
      } catch {
        console.log("%c SessionStorage에 토큰 없음.", "color: #d93d1a;");
        navigate("/");
      }
      // fetchCurrentUser 과정이 끝났으므로, isFetchCompleted 상태를 true로 바꿔줌
    };

    useEffect(() => {
      fetchCurrentUser();
    }, []);

    return isFetchCompleted ? <InnerComponent /> : null;
  };
};

export default withUser;
