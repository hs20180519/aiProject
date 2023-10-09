import "../styles/IntroPage.css";
import { Button } from "@chakra-ui/react";
import KakaoButton from "../components/KakaoButton";

export default function IntroPage() {
  return (
    <>
      <div className={"user-join"}>
        <p>{"회원가입"}</p>
        <p>{"로그인"}</p>
        <KakaoButton />
      </div>
      <div className={"info"}>{"서비스 소개"}</div>
      <Button className={"test-btn"}>{"단어 학습 체험하러가기"}</Button>
    </>
  );
}
