import { Link } from "react-router-dom";
import { Button } from "@chakra-ui/react";
import styled from "@emotion/styled";

/** 유저 로그인 상태일 경우 MainPage로 이동 */
export default function IntroPage() {
  return (
    <StyledContainer>
      <Link to={"/login"}>
        <StyledLoginHeader>{"로그인"}</StyledLoginHeader>
      </Link>
      <StyledWrapper>
        <StyledLogoWrapper>{"사이트 로고"}</StyledLogoWrapper>
        <StyledContent>{"사이트 설명"}</StyledContent>
        <StyledContent>
          <Button>{"학습 체험하러 가기"}</Button>
        </StyledContent>
      </StyledWrapper>
    </StyledContainer>
  );
}

const StyledLoginHeader = styled(Button)`
  position: fixed;
  top: 24px;
  right: 24px;
`;
const StyledContainer = styled.div`
  width: 100%;
  height: 100%;
`;

const StyledWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const StyledLogoWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const StyledContent = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;
