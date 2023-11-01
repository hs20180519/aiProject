import { ChangeEvent, useState } from "react";
import axios from "axios";
import { useParams } from "react-router";
import { Box, useToast } from "@chakra-ui/react";
import GrammarHeading from "./Components/GrammarHeading";
import GrammarInputBox from "./Components/GrammarInputBox";
import GrammarResultBox from "./Components/GrammarResultBox";

const GrammarPage = () => {
  const { word } = useParams<{ word: string }>();
  const [inputText, setInputText] = useState(""); // 입력 필드의 상태
  const [responseData, setResponseData] = useState(null);
  const toast = useToast();
  const TOAST_TIMEOUT_INTERVAL = 800;
  const apiUrl = process.env.REACT_APP_GPT_SVR_URL;

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value); // 입력 필드의 내용을 상태에 업데이트
    if (inputText.length > 255) {
      toast({
        title: "Input Length Exceeded",
        description: "입력은 256자를 초과할 수 없습니다.",
        status: "error",
        isClosable: true,
        duration: TOAST_TIMEOUT_INTERVAL,
      });
    }
  };

  const handlePostRequest = async () => {
    try {
      const response = await axios.post(`${apiUrl}/grammar/correct`, {
        sentence: inputText, // 사용자 입력을 서버로 전송
      });
      setResponseData(response.data);
      toast({
        title: "Success!",
        description: "성공적으로 문법을 교정했습니다.",
        status: "success",
        isClosable: true,
        duration: TOAST_TIMEOUT_INTERVAL,
      });
    } catch (error) {
      toast({
        title: "Server Disconnection",
        description: "사용자 입력을 전송하는데 실패하였습니다.",
        status: "error",
        isClosable: true,
        duration: TOAST_TIMEOUT_INTERVAL,
      });
    }
  };

  return (
    <Box
      h="calc(90vh)"
      textAlign={"center"}
      borderTop="10px"
      marginBottom="10px"
      p={3}
      borderWidth="1px"
      borderRadius="md"
      maxW="2000px"
      boxShadow="lg"
      backgroundColor="white"
    >
      <GrammarHeading />

      <Box whiteSpace="pre-line" fontSize="16px">
        {word == "ai"
          ? `자유롭게 영작을 해주세요. 
        wordy가 문법을 고쳐줄 거예요!`
          : `${word}가 포함된 문장을 입력해주세요!`}
      </Box>

      <GrammarInputBox
        inputText={inputText}
        handleInputChange={handleInputChange}
        handlePostRequest={handlePostRequest}
      />
      <GrammarResultBox responseData={responseData} />
    </Box>
  );
};

export default GrammarPage;
