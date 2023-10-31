import React, { ChangeEvent, useState } from "react";
import axios from "axios";
import { useParams } from "react-router";
import { Input, Button, VStack, HStack, Box, Heading } from "@chakra-ui/react";

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

  return (
    <VStack
      fontFamily="monospace"
      h="calc(90vh)"
      spacing={8}
      p={8}
      borderWidth="1px"
      borderRadius="md"
      maxW="2000px"
      boxShadow="lg"
      backgroundColor="white"
    >
      <Heading
        as="h1"
        size="xl"
        fontFamily="monospace"
        sx={{
          "@keyframes fly": {
            "0%": { transform: "translateY(0)" },
            "50%": { transform: "translateY(-10px)" },
            "100%": { transform: "translateY(0)" },
          },
          "&.flying-text": {
            animation: "fly 2s infinite",
          },
        }}
        className="flying-text"
      >
        문법 교정기
      </Heading>

      <Box>
        {/* 줄바꿈 넣고 싶어요 */}
        {word == "ai"
          ? `자유롭게 영작을 해주세요. 
        wordy가 문법을 고쳐줄 거예요!`
          : `${word}가 포함된 문장을 입력해주세요!`}
      </Box>
      <HStack width="70%" fontFamily="monospace">
        <Input
          size="lg"
          value={inputText}
          onChange={handleInputChange}
          placeholder="문장을 입력하세요"
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

      <VStack align="start" spacing={4} width="70%">
        <Box fontSize={"15px"}>교정된 문장 :</Box>
        <Box
          fontFamily="monospace"
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
