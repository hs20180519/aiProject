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
        <StyledLogoWrapper>
          <StyledLogoImage src={`${process.env.PUBLIC_URL}/images/logo.png`} alt={"wordy"} />
        </StyledLogoWrapper>
        <StyledContent>
          {"단어 학습이 어려운 분들을 위해 준비했습니다. AI튜터와 함께 단어 학습을 해보세요."}
        </StyledContent>
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
const StyledLogoImage = styled.img`
  width: 100%;
  height: 100%;
  max-width: 244px;
  max-height: 88px;
  object-fit: fill;
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
