import React, { ChangeEvent, useState } from "react";
import axios from "axios";
import { Input, Button, VStack, HStack, Box, Center, Heading } from "@chakra-ui/react";

// Todo: 컴포넌트로 나누기 ? 모듈화 ?

const GrammarPage = () => {
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
  return (
    <Center height="100vh">
      <VStack
        spacing={4}
        p={6}
        borderWidth="1px"
        borderRadius="md"
        maxW="400px"
        boxShadow="lg"
        backgroundColor="white"
      >
        <Heading as="h1" size="lg">
          문법 교정기
        </Heading>

        <Box>
          <strong>{`{word}`}</strong>가 포함된 문장을 입력해주세요! <br />
          <strong>우리 wordy</strong>가 고쳐줄 거예요!
        </Box>
        <HStack width="100%">
          <Input
            size="md"
            value={inputText}
            onChange={handleInputChange}
            placeholder="Enter your text"
            isTruncated
            style={{ width: "400px" }}
            borderColor="lightgray"
          />
          <Button colorScheme="teal" onClick={handlePostRequest}>
            Submit
          </Button>
        </HStack>

        {responseData && (
          <VStack align="start" spacing={4} width="100%">
            <Box
              border="1px"
              p={4}
              borderRadius="md"
              width="100%"
              overflow="auto"
              borderColor="lightgray"
            >
              <strong>입력한 문장:</strong> {inputText}
            </Box>
            <Box
              border="1px"
              p={4}
              borderRadius="md"
              width="100%"
              overflow="auto"
              borderColor="lightgray"
            >
              <strong>교정된 문장:</strong> {responseData}
            </Box>
          </VStack>
        )}
      </VStack>
    </Center>
  );
};

export default GrammarPage;
