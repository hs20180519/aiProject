<<<<<<< HEAD
import React, { ChangeEvent, SyntheticEvent, useState } from "react";
=======
import React, { ChangeEvent, SyntheticEvent, useState, useEffect } from "react";
>>>>>>> d13233f45cb7366d46efd6a16797f00687882c0d
import { useNavigate } from "react-router-dom";
import { AxiosError } from "axios";
import * as Api from "../../apis/api";
import validateEmail from "../../libs/validateEmail";

type NewUserInfoType = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  verificationCode: string;
};

let timer: NodeJS.Timer;

const SignUp = () => {
  const [newUserInfo, setNewUserInfo] = useState<NewUserInfoType>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    verificationCode: "", // 이메일 인증 코드 필드 추가
  });

  const { name, email, password, confirmPassword, verificationCode } = newUserInfo;

  const navigate = useNavigate();
  const [isEmailAvailable, setIsEmailAvailable] = useState<boolean | null>(null);
  const [emailVerificationStatus, setEmailVerificationStatus] = useState<string | null>(null);

  const getEmailStatus = () => {
    if (isEmailAvailable) {
      return "이 이메일은 사용 가능합니다.";
    }
    if (isEmailAvailable === false) {
      return "이미 사용 중인 이메일 주소입니다.";
    }
    if (isEmailAvailable === undefined) {
      return "이메일 가용성 확인 중 오류가 발생했습니다.";
    }
    return ""; // 반환값이 없을 경우 빈 문자열 반환
  };

  const checkEmailAvailability = async (email: string) => {
    try {
      const response = await Api.get(`/api/auth/check?email=${email}`);
      const { isAvailable } = response.data;
      if (isAvailable) {
        setIsEmailAvailable(true);
        // 이메일이 사용 가능하면 이메일 인증 요청
        await emailVerification(email);
      } else {
        setIsEmailAvailable(false);
      }
    } catch (err) {
      console.error("이메일 중복 확인 중 오류 발생:", err);
      setIsEmailAvailable(undefined);
    }
  };

  const emailVerification = async (email: string) => {
    try {
      await Api.post(`/api/auth/register`, { email });
    } catch (err) {
      console.error("이메일 인증 중 오류 발생:", err);
    }
  };

  const verifyEmailCode = async (verificationCode: string) => {
    try {
      await Api.post(`/api/auth/verify`, { verificationCode });
      setEmailVerificationStatus("이메일 인증이 완료되었습니다.");
    } catch (err) {
      console.error("이메일 인증 코드 확인 중 오류 발생:", err);
      setEmailVerificationStatus("이메일 인증 코드 확인 중 오류가 발생했습니다.");
    }
  };

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setNewUserInfo({
      ...newUserInfo,
      email: value,
    });
    setEmailVerificationStatus(""); // 이메일이 변경될 때 초기화

    if (timer) clearTimeout(timer);

    timer = setTimeout(() => {
      checkEmailAvailability(value);
    }, 1000);
  };

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    try {
      if (isFormValid && isEmailAvailable) {
        // 이메일 인증 코드 확인
        await verifyEmailCode(verificationCode);
        // 회원가입 요청
        await Api.post("/api/auth/signup", {
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
  const isVerificationCodeValid = verificationCode.length > 0;

  const isFormValid =
    isNameValid && isEmailValid && isPasswordValid && isPasswordSame && isVerificationCodeValid;

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewUserInfo({
      ...newUserInfo,
      [name]: value,
    });
  };

  const navigateToIntroPage = () => {
    navigate("/");
  };

  const signUpPageInputForms = [
    {
      label: "이름",
      type: "text",
      placeholder: "이름을 입력하세요.",
      name: "name",
      onChange: handleChange,
      dangerText: {
        condition: !isNameValid && name.length > 0,
        text: "이름은 2글자 이상으로 설정해 주세요.",
      },
    },
    {
      label: "이메일",
      type: "text",
      placeholder: "생성할 이메일을 입력하세요.",
      name: "email",
      onChange: handleEmailChange,
      dangerText: {
        condition: !isEmailValid && email.length > 0,
        text: "이메일 형식이 올바르지 않습니다.",
      },
    },
    {
      label: "비밀번호",
      type: "password",
      placeholder: "비밀번호를 입력하세요.",
      name: "password",
      onChange: handleChange,
      dangerText: {
        condition: !isPasswordValid && password.length > 0,
        text: "비밀번호는 4글자 이상으로 설정해 주세요.",
      },
    },
    {
      label: "비밀번호 확인",
      type: "password",
      placeholder: "비밀번호를 다시 입력하세요.",
      name: "confirmPassword",
      onChange: handleChange,
      dangerText: {
        condition: !isPasswordValid && confirmPassword.length > 0,
        text: "비밀번호가 일치한지 확인해 주세요.",
      },
    },
    {
      label: "이메일 인증 코드",
      type: "text",
      placeholder: "이메일에서 받은 인증 코드를 입력하세요.",
      name: "verificationCode",
      onChange: handleChange,
    },
  ];

  return (
    <form onSubmit={handleSubmit}>
      <div
        style={{
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
            <div
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
              {signUpPageInputForms.map((i) => (
                <div className={"form-group"} key={i.name}>
                  <label style={{ fontSize: "18px" }}>{i.label}</label>
                  <input
                    type={i.type}
                    className={"form-control"}
                    placeholder={i.placeholder}
                    name={i.name}
                    value={newUserInfo[i.name]}
                    onChange={i.onChange}
                  />
                  {i.name === "email" && (
                    <div className={"email-status"}>
                      {getEmailStatus()}{" "}
                      {/* getEmailStatus 함수를 호출하여 이메일 상태 메시지를 표시 */}
                      <button
                        type="submit"
                        className={"btn btn-primary"}
                        onClick={() => emailVerification(email)}
                        disabled={!isFormValid}
                      >
                        {"이메일 인증 요청"}
                      </button>
                    </div>
                  )}
                  {i.dangerText?.condition && (
                    <div className={"text-danger"}>{i.dangerText.text}</div>
                  )}
                </div>
              ))}
              <button type={"submit"} className={"btn btn-primary"} disabled={!isFormValid}>
                {"회원가입\r"}
              </button>
              <button onClick={navigateToIntroPage}>홈 화면으로 이동</button>
              {emailVerificationStatus && (
                <div className={"text-info"}>{emailVerificationStatus}</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default SignUp;
