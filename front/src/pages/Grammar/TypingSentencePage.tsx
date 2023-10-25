import styled from "@emotion/styled";
import { useParams } from "react-router-dom";
import { ChangeEvent, useState } from "react";
import GrammarInput from "../../components/GrammarFix";

/**
 * 추가 작업할 것: 유저가 선택한 단어가 넘어오게 설정해줘야함
 * 페이지 틀 잡히면 해당 파일은 컴포넌트로 변경
 */
export default function TypingSentencePage() {
  const { word } = useParams();
  const [userInput, setUserInput] = useState("");
  const [fixedSentence, setFixedSentence] = useState("");
  const [translation, setTranslation] = useState("");

  const handleSubmitUserInput = (e: ChangeEvent<HTMLInputElement>) => {
    setUserInput(e.target.value);
  };
  const handleGetFixedGrammar = (e: ChangeEvent<HTMLInputElement>) => {
    setFixedSentence(e.target.value);
  };
  const handleGetTranslation = (e: ChangeEvent<HTMLInputElement>) => {
    setTranslation(e.target.value);
  };

  return (
    <StyledContainer>
      <StyledWrapper>
        <StyledFlexbox>
          <GrammarInput
            label={`${word}가 포함된 영작을 해주세요` || "자유롭게 영작을 해주세요"}
            value={userInput}
            onChange={handleSubmitUserInput}
            placeholder={"문장을 입력해주세요"}
          />
          <GrammarInput
            label={"교정된 문장"}
            value={fixedSentence}
            onChange={handleGetFixedGrammar}
            placeholder={""}
          />
          <GrammarInput
            label={"해석"}
            value={translation}
            onChange={handleGetTranslation}
            placeholder={""}
          />
        </StyledFlexbox>
      </StyledWrapper>
    </StyledContainer>
  );
}

const StyledContainer = styled.div`
  width: 100%;
  height: 100%;
`;

const StyledWrapper = styled.div`
  width: 100%;
  height: 100%;
  padding: 64px;
`;

const StyledFlexbox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;
