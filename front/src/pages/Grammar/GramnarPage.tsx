import React, { ChangeEvent, useState } from "react";
import axios from "axios";
import { useParams } from "react-router";
import { Input, Button, VStack, HStack, Box, Heading, StackDivider } from "@chakra-ui/react";

// Todo: 컴포넌트로 나누기 ? 모듈화 ?
// params로 word 받기

const GrammarPage = () => {
  const { word } = useParams<{ word }>();
  const [inputText, setInputText] = useState(""); // 입력 필드의 상태
  const [responseData, setResponseData] = useState(null);
  const apiUrl = process.env.REACT_APP_GPT_SVR_URL;

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value); // 입력 필드의 내용을 상태에 업데이트
  };

  const handlePostRequest = async () => {
    try {
      const response = await axios.post(`${apiUrl}/grammar/correct`, {
        sentence: inputText, // 사용자 입력을 서버로 전송
      });
      setResponseData(response.data);
    } catch (error) {
      console.error("Error sending data:", error);
    }
  };

  // word가 정의되지 않은 경우를 처리
  const renderContent = () => {
    if (!word) {
      return <div>자유롭게 영작을 해주세요!</div>;
    }
    return (
      // word가 정의된 경우 처리할 내용
      <div>
        <strong>{word}</strong>가 포함된 문장을 입력해주세요!
        <br />
        <strong>우리 wordy</strong>가 고쳐줄 거예요!
      </div>
    );
  };

  return (
    <VStack
      // divider={<StackDivider borderColor="gray.200" />}
      h="calc(90vh)"
      spacing={8}
      p={8}
      borderWidth="1px"
      borderRadius="md"
      maxW="2000px"
      boxShadow="lg"
      backgroundColor="white"
    >
      <Heading as="h1" size="lg">
        문법 교정기
      </Heading>

      <Box>
        {word == "ai" ? `자유롭게 영작을 해주세요!` : `${word}가 포함된 문장을 입력해주세요!`}
      </Box>
      {/* {renderContent()} */}
      <HStack width="70%">
        <Input
          size="lg"
          value={inputText}
          onChange={handleInputChange}
          placeholder="문장을 입력해주세요."
          isTruncated
          width="100%"
          borderColor="lightgray"
        />
        <Box>
          <Button colorScheme="teal" onClick={handlePostRequest}>
            입력
          </Button>
        </Box>
      </HStack>

      {/* {responseData && ( */}
      <VStack align="start" spacing={4} width="70%">
        <Box
          border="1px"
          p={6}
          borderRadius="md"
          width="100%"
          height="200"
          overflow="auto"
          borderColor="lightgray"
        >
          {responseData}
        </Box>
      </VStack>
    </VStack>
  );
};

export default GrammarPage;
