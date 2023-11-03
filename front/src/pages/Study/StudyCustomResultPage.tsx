import React, { useEffect, useState } from "react";
import { FetchStudyWords } from "../../apis/studyWord";
import {
  Tooltip,
  useToast,
  Checkbox,
  Button,
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Td,
  Text,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const StudyCustomResultPage = () => {
  const [resultData, setResultData] = useState([]);
  const [checkedWords, setCheckedWords] = useState({});
  const [checkedCount, setCheckedCount] = useState(0);

  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await FetchStudyWords.getLearnResult();
        const resultData = response.data;
        setResultData(resultData);
        console.log(resultData)
      } catch (error) {
        console.error("Error fetching results:", error);
      }
    };

    fetchResults();
  }, []);

  const totalAnswers = resultData.length;
  const correctAnswers = resultData.filter((result) => result.correct).length;

  const handleContinueLearning = () => {
    navigate("/main/custom")
  };

  const handleStopLearning = () => {
    navigate("/main")
  };

  const handleSendCheckedWords = () => {
    const selectedWords = {};
    for (const result of resultData) {
      if (checkedWords[result.word.word]) {
        selectedWords[result.word.word] = result.word.meaning;
      }
    }
    navigate("/main/param_gpt_dialog", { state: { receivedWords: selectedWords } });
  };

  const toggleCheckbox = (word) => {
    setCheckedWords((prevState) => {
      const newCheckedWords = { ...prevState, [word]: !prevState[word] };
      const newCount = Object.values(newCheckedWords).filter(Boolean).length;

      if (newCount <= 3) {
        setCheckedCount(newCount);
        return newCheckedWords;
      } else {
        toast({
          title: "단어는 3개까지 선택 가능 합니다.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        return prevState;
      }
    });
  };

  return (
    <Box background="white" boxShadow="md" p={4} rounded="md" flexGrow={1} width="100%">
      <Text fontSize="lg" fontWeight="bold" mb={4}>
      ✏️단어 학습 결과 <br /> (정답 개수 {correctAnswers}개 / 총 단어 개수 {totalAnswers}개)
      </Text>
      <Box border="1px" borderRadius="md" borderColor="gray.200" overflow="auto" p="1" m="1">
        <Table>
        <Thead>
        <Tr>
          <Td></Td>
          <Td  p="0.2rem" textAlign="center">번호</Td>
          <Td  p="0.2rem" textAlign="center">정답여부</Td>
          <Td  p="0">
            <Table>
              <Tr>
                <Td  p="0.2rem" textAlign="center">단어</Td>
              </Tr>
              <Tr>
                <Td  p="0.2rem" textAlign="center">뜻</Td>
              </Tr>
            </Table>
          </Td>
        </Tr>
      </Thead>
          <Tbody>
            {resultData.map((result, index) => (
              <Tr key={index}>
                <Td p="0.2rem" textAlign="center">
                  <Checkbox
                    isChecked={checkedWords[result.word.word] || false}
                    onChange={() => toggleCheckbox(result.word.word)}
                  />
                </Td>
                <Td p="0.2rem" textAlign="center">{index + 1}</Td>
                <Td p="0.2rem" textAlign="center">{result.correct ? "⭕" : "❌"}</Td>
                <Td  p="0">
              <Table>
                <Tr>
                <Td p="0.2rem" textAlign="center">{result.word.word}</Td>
                </Tr>
                <Tr>
                <Td p="0.2rem" textAlign="center">{result.word.meaning}</Td>
                </Tr>
              </Table>
            </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
        {checkedCount > 0 && ( // checkedCount가 0보다 클 때만 출력
          <Box textAlign="left">
            <Text fontSize="sm" fontWeight="light" mb={2} color="gray.600">
              {checkedCount} 개 선택됨
            </Text>
          </Box>
        )}
      </Box>

      <Box textAlign="center">
        <Tooltip
          label={checkedCount === 0 ? "단어를 먼저 선택해주세요!" : ""}
          placement="top-start"
        >
          <Button
            onClick={handleSendCheckedWords}
            isDisabled={checkedCount === 0}
            colorScheme="blue"
            m={2}
          >
            스크립트로 공부하러 가기
          </Button>
        </Tooltip>
        <Button
          colorScheme="teal"
          m={2}
          onClick={handleContinueLearning}
        >
          단어학습 더 하기
        </Button>
        <Button
          colorScheme="orange"
          m={2}
          onClick={handleStopLearning}>
          학습 끝내기
        </Button>
      </Box>
    </Box>
  );
};

export default StudyCustomResultPage;
