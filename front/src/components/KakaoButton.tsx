import { Button } from "@chakra-ui/react";

// 유저 로그인 컴포넌트 구현시 api 연결 예정
export default function KakaoButton() {
  /**
   * @description URL 가져오기
   */
  const fetchGetURL = async () => {
    try {
      const { url } = await (await fetch(`${process.env.BASE_URL}/kakao/url`)).json();

      console.log(url);
    } catch (error) {
      alert("Function fetchGetURL error!");
      console.error(error);
    }
  };

  return (
    <Button className="kakao" variant="outline" onClick={fetchGetURL}>
      카카오 로그인하기
    </Button>
  );
}
