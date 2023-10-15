/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { ChangeEvent, SyntheticEvent, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AxiosError } from "axios";
import * as Api from "../apis/api";
// import ToastWrapper from "../components/common/popup/ToastWrapper";
// import useToast from "../hooks/useToast";
// import {
//   TOAST_POPUP_POSITION,
//   TOAST_POPUP_STATUS,
// } from "../constants";

interface NewUserInfoType {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const SignUp = () => {
  const location = useLocation();
  const [newUserInfo, setNewUserInfo] = useState<NewUserInfoType>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const { name, email, password, confirmPassword } = newUserInfo;

  const navigate = useNavigate();
  // const { showToast, toastData, setShowToast } = useToast();

  /** 이메일이 "abc@example.com" 형태인지 regex를 이용해 확인함. */
  const validateEmail = (email: string): boolean => {
    return (
      email
        .toLowerCase()
        .match(
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        ) !== null
    );
  };

  /** 이름이 2글자 이상인지 여부를 확인함. */
  const isNameValid = name.length >= 2;
  /** 위 validateEmail 함수를 통해 이메일 형태 적합 여부를 확인함. */
  const isEmailValid = validateEmail(email);
  /** 비밀번호가 4글자 이상인지 여부를 확인함. */
  const isPasswordValid = password.length >= 4;
  /** 비밀번호와 확인용 비밀번호가 일치하는지 여부를 확인함. */
  const isPasswordSame = password === confirmPassword;

  /** 위 4개 조건이 모두 동시에 만족되는지 여부를 확인함. */
  const isFormValid = isNameValid && isEmailValid && isPasswordValid && isPasswordSame;

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    // 여기에서 실제 회원가입 로직을 구현하고 서버와 통신하면 됩니다.
    try {
      if (isFormValid)
        await Api.post("auth/register", {
          name,
          email,
          password,
        });
      navigate("/login");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      if (err instanceof AxiosError) {
        /* empty */
      }
      console.error(err.response.data);
    }
  };

  /** input onChange Event가 들어가는 함수!
   * name에 맞는 데이터를 변경해줍니다.
   * = 아래 주석처리된 것처럼 newUserInfo에 할당된 name값과 같은 value를 변경해줍니다.
   */
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // newUserInfo["name"] = value;
    setNewUserInfo({
      ...newUserInfo,
      [name]: value,
    });
  };

  useEffect(() => {
    console.log(location);
  }, [location]);

  return (
    <>
      {/* {showToast && <ToastWrapper toastData={toastData} />} */}
      <div
        style={{
          paddingTop: "134px",
          height: "100vh",
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
            <h2 style={{ textAlign: "center" }}>{"워디 회원가입"}</h2>
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
                <label style={{ fontSize: "18px" }}>{"이름"}</label>
                <input
                  type={"text"}
                  className={"form-control"}
                  placeholder={"이름을 입력하세요."}
                  name="name"
                  value={name}
                  onChange={handleChange}
                />
                {!isNameValid && name.length > 0 && (
                  <div className={"text-danger"}>{"이름은 2글자 이상으로 설정해 주세요."}</div>
                )}
              </div>
              <div className={"form-group"}>
                <label style={{ fontSize: "18px" }}>{"이메일"}</label>
                <input
                  type={"text"}
                  className={"form-control"}
                  placeholder={"생성할 이메일을 입력하세요."}
                  value={email}
                  name="email"
                  onChange={handleChange}
                />
                {!isEmailValid && email.length > 0 && (
                  <div className={"text-danger"}>{"이메일 형식이 올바르지 않습니다."}</div>
                )}
              </div>
              <div className={"form-group"}>
                <label style={{ fontSize: "18px" }}>{"비밀번호"}</label>
                <input
                  type={"password"}
                  className={"form-control"}
                  placeholder={"비밀번호를 입력하세요."}
                  value={password}
                  name="password"
                  onChange={handleChange}
                />
                {!isPasswordValid && password.length > 0 && (
                  <div className={"text-danger"}>{"비밀번호는 4글자 이상으로 설정해 주세요."}</div>
                )}
              </div>
              <div className={"form-group"}>
                <label style={{ fontSize: "18px" }}>{"비밀번호 확인"}</label>
                <input
                  type={"password"}
                  className={"form-control"}
                  placeholder={"비밀번호 확인."}
                  value={confirmPassword}
                  name="confirmPassword"
                  onChange={handleChange}
                />
                {!isPasswordValid && confirmPassword.length > 0 && (
                  <div className={"text-danger"}>{"비밀번호가 일치한지 확인해 주세요."}</div>
                )}
              </div>
              <button type={"submit"} className={"btn btn-primary"} disabled={!isFormValid}>
                {"회원가입\r"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignUp;
