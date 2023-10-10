import "../styles/IntroPage.css";
import { Button } from "@chakra-ui/react";
import KakaoLoginButton from "../components/KakaoLoginButton";

/** 유저 로그인 상태일 경우 MainPage로 이동 */
export default function IntroPage() {
  return (
    <>
      <div className={"user-join"}>
        <p>{"네비게이션바"}</p>
        {/* 아래 카카오 버튼은 유저 로그인 페이지 구현 완료 시 옮기기! */}
        <KakaoLoginButton />
      </div>
      <div className={"info"}>
        <p>{"서비스 소개"}</p>
        <Button className={"test-btn"}>{"단어 학습 체험하러가기"}</Button>
      </div>
    </>
  );
}
