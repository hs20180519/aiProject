/* eslint-disable */
import React, { SyntheticEvent, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import * as Api from "../apis/api";
import { DispatchContext } from "../App";
import { UserProps } from "../reducer";
import KakaoLoginButton from "../components/KakaoLoginButton";

interface LoginProps {
  email: string;
  password: string;
}

const LoginPage = () => {
  const [formData, setFormData] = useState<LoginProps>({
    email: "",
    password: "",
  });

  const { email, password } = formData;

  const navigate = useNavigate();
  const dispatch = useContext(DispatchContext);

  const validateEmail = (email: string) => {
    return (
      email
        .toLowerCase()
        .match(
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zAZ]{2,}))$/,
        ) !== null
    );
  };

  const isEmailValid = validateEmail(email);
  const isPasswordValid = password.length >= 4;
  const isFormValid = isEmailValid && isPasswordValid;

  function userTypeGuard(arg: any): arg is UserProps {
    return "nickname" in arg && "name" in arg && "email" in arg;
  }

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();

    try {
      const res = await Api.post("/auth", {
        email,
        password,
      });
      const user = res.data;
      if (!user) {
        throw new Error("유저 정보 없음");
      }
      if (userTypeGuard(user)) {
        const jwtToken = user.token;
        sessionStorage.setItem("userToken", jwtToken);

        dispatch({ type: "LOGOUT" });
        navigate("/", { replace: true });
      }
    } catch (err) {
      const objectErr = err as any;
      window.alert(objectErr.response.data);
    }
  };

  return (
    <>
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
            <h2 style={{ textAlign: "center" }}>{"워디 로그인"}</h2>
            <form
              onSubmit={handleSubmit}
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                height: "100%",
                width: "100%",
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
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
                {!isEmailValid && email.length > 0 && (
                  <div className={"text-danger"}>
                    {`이메일 형식이 올바르지 않습니다.`}
                  </div>
                )}
              </div>
              <div className={"form-group"}>
                <label style={{ fontSize: "18px" }}>{"비밀번호"}</label>
                <input
                  type={"password"}
                  className={"form-control"}
                  placeholder={"비밀번호를 입력하세요."}
                  value={password}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, password: e.target.value })}
                />
                {!isPasswordValid && password.length > 0 && (
                  <div className={"text-danger"} style={{ color: "#FF6347" }}>
                    {"비밀번호는 4글자 이상입니다."}
                  </div>
                )}
              </div>
              <button type={"submit"} className={"btn btn-primary"} disabled={!isFormValid}>
                {"로그인"}
              </button>
              <p style={{ fontSize: "14px" }}>
                {"아직 회원이 아니시라면?"}{" "}
                <button
                  type={"button"}
                  className={"btn btn-link"}
                  onClick={() => navigate("/SignUp")}
                >
                  {"회원가입"}
                </button>
                <KakaoLoginButton />
              </p>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
