/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
// import * as Api from "../Api";
// import { DispatchContext } from "../App";
// import useToast from "../hooks/useToast";
// import ToastWrapper from "../components/common/popup/ToastWrapper";
// import { TOAST_POPUP_STATUS } from "../constants";

interface LoginProps {}

const Login: React.FC<LoginProps> = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const navigate = useNavigate();
  // const dispatch = useContext(DispatchContext);
  // const { showToast, toastData, setShowToast } = useToast();

  const validateEmail = (email: string): boolean => {
    return (
      email
        .toLowerCase()
        .match(
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        ) !== null
    );
  };

  const isEmailValid: boolean = validateEmail(email);
  const isPasswordValid: boolean = password.length >= 4;
  const isFormValid: boolean = isEmailValid && isPasswordValid;

  // const handleSubmit = async (e: SyntheticEvent) => {
  //   e.preventDefault();

  //   try {
  //     const res = await Api.post("auth/login", {
  //       email,
  //       password,
  //     });
  //     const user = res.data;
  //     if (!user) throw new Error("유저 정보 없음");
  //     const jwtToken = user.token;
  //     sessionStorage.setItem("userToken", jwtToken);
  //     dispatch({
  //       type: "LOGIN_SUCCESS",
  //       payload: user,
  //     });
  //     navigate("/", { replace: true });
  //   } catch (err) {
  //     window.alert(err.response.data);
  //   }
  // };

  return (
    <>
      {/* {showToast && <ToastWrapper toastData={toastData} />} */}
      <div
        style={{
          paddingTop: "134px",
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{
            width: "300px",
            boxShadow: "0px 4px 12px #00000026",
          }}
        >
          <div
            className={"container"}
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
              gap: "16px",
              padding: "16px",
            }}
          >
            <h2 style={{ textAlign: "center" }}>{"로그인"}</h2>
            <form
              // onSubmit={handleSubmit}
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
                gap: "16px",
              }}
            >
              <div className={"form-group"}>
                <label style={{ fontSize: "18px" }}>{"이메일"}</label>
                <input
                  type={"text"}
                  className={"form-control"}
                  placeholder={"이메일을 입력하세요."}
                  value={email}
                  // eslint-disable-next-line prettier/prettier
                  onChange={e => setEmail(e.target.value)}
                />
                {!isEmailValid && email.length > 0 && (
                  <div className={"text-danger"}>{`이메일 형식이 올바르지 않습니다.`}</div>
                )}
              </div>
              <div className={"form-group"}>
                <label style={{ fontSize: "18px" }}>{"비밀번호"}</label>
                <input
                  type={"password"}
                  className={"form-control"}
                  placeholder={"비밀번호를 입력하세요."}
                  value={password}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                />
                {!isPasswordValid && password.length > 0 && (
                  <div className={"text-danger"} style={{ color: "#FF6347" }}>
                    {"비밀번호는 4글자 이상입니다.\r"}
                  </div>
                )}
              </div>
              <button type={"submit"} className={"btn btn-primary"} disabled={!isFormValid}>
                {"로그인\r"}
              </button>
              <button
                type={"button"}
                className={"btn btn-link"}
                onClick={() => navigate("/SignUp")}
              >
                {"회원가입\r"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
