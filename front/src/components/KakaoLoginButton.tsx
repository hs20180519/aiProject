// 유저 로그인 페이지 구현시 api 연결 예정
export default function KakaoLoginButton() {
  return (
    <a href={"http://localhost:8000/auth/kakao"}>
      <img src={`${process.env.PUBLIC_URL}/images/kakao_login.png`} alt={"카카오 로그인"} />
    </a>
  );
}
