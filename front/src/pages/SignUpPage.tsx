/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { ChangeEvent, SyntheticEvent, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AxiosError } from "axios";
import * as Api from "../apis/api";

type NewUserInfoType = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const validateEmail = (email: string): boolean => {
  return (
    email
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zAZ]{2,}))$/,
      ) !== null
  );
};

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

  const [isEmailAvailable, setIsEmailAvailable] = useState<boolean | null>(null);
  const [emailVerificationStatus, setEmailVerificationStatus] = useState<string | null>(null);

  const checkEmailAvailability = async (email: string) => {
    try {
      const response = await Api.get(`/auth/check?email=${email}`);
      const { isAvailable } = response.data;
      if (isAvailable) {
        setIsEmailAvailable(true);
        setEmailVerificationStatus("이 이메일은 사용 가능합니다.");
      } else {
        setIsEmailAvailable(false);
        setEmailVerificationStatus("이미 사용 중인 이메일 주소입니다.");
      }
    } catch (err) {
      console.error("이메일 중복 확인 중 오류 발생:", err);
      setEmailVerificationStatus("이메일 가용성 확인 중 오류가 발생했습니다.");
    }
  };

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setIsEmailAvailable(null); // 이메일이 변경될 때 초기화
    setNewUserInfo({
      ...newUserInfo,
      email: value,
    });
    checkEmailAvailability(value); // 이메일이 변경될 때 중복 확인 요청 보내기
  };

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    try {
      if (isFormValid && isEmailAvailable) {
        await Api.post("auth/register", {
          name,
          email,
          password,
        });
        navigate("/login");
      }
    } catch (err) {
      if (err.isAxiosError) {
        const axiosError = err as AxiosError;
        console.error(axiosError.response?.data);
      } else {
        console.error(err);
      }
    }
  };

  const isNameValid = name.length >= 2;
  const isEmailValid = validateEmail(email);
  const isPasswordValid = password.length >= 4;
  const isPasswordSame = password === confirmPassword;

  const isFormValid = isNameValid && isEmailValid && isPasswordValid && isPasswordSame;

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
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
      <form onSubmit={handleSubmit}>
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
                    onChange={handleEmailChange}
                  />
                  {!isEmailValid && email.length > 0 && (
                    <div className={"text-danger"}>{"이메일 형식이 올바르지 않습니다."}</div>
                  )}
                  {isEmailAvailable === false && (
                    <div className={"text-danger"}>{"이미 사용 중인 이메일 주소입니다."}</div>
                  )}
                  {isEmailAvailable === true && (
                    <div className={"text-success"}>{emailVerificationStatus}</div>
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
                    <div className={"text-danger"}>
                      {"비밀번호는 4글자 이상으로 설정해 주세요."}
                    </div>
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
      </form>
    </>
  );
};

export default SignUp;
