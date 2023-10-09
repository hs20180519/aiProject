import "../styles/MainPage.css";
import KakaoButton from "../components/KakaoButton";
import { Button } from "@chakra-ui/react";

export default function MainPage() {
  return (
    <>
      <div className="user-join">
        <p>회원가입</p>
        <p>로그인</p>
        <KakaoButton />
      </div>
      <div className="info">서비스 소개</div>
      <Button className="test-btn">레벨테스트 하러가기</Button>
    </>
  );
}
