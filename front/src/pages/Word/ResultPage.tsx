import React, { useEffect, useState } from "react";
import { Box, Table, Thead, Tbody, Tr, Th, Td, Text, Button, Link } from "@chakra-ui/react";
import { FetchStudyWords } from "../../apis/studyWord";
import { Link as RouterLink } from "react-router-dom";

const ResultPage = () => {
  const [resultData, setResultData] = useState([]);

  useEffect(() => {
    // Fetch results data from the backend when the component mounts
    const fetchResults = async () => {
      try {
        const response = await FetchStudyWords.getLearnResult();
        const resultData = response.data;
        setResultData(resultData);
      } catch (error) {
        console.error("Error fetching results:", error);
      }
    };

    fetchResults();
  }, []);

  // Calculate the number of correct answers and total answers
  const totalAnswers = resultData.length;
  const correctAnswers = resultData.filter((result) => result.correct).length;

  return (
    <Box>
      <Text fontSize="2xl" fontWeight="bold" mb={4}>
        단어 학습 결과 (정답 개수 {correctAnswers}개 / 총 단어 개수 {totalAnswers}개)
      </Text>
      <Table>
        <Thead>
          <Tr>
            <Th>번호</Th>
            <Th>정답여부</Th>
            <Th>단어</Th>
            <Th>뜻</Th>
          </Tr>
        </Thead>
        <Tbody>
          {resultData.map((result, index) => (
            <Tr key={index}>
              <Td>{index + 1}</Td>
              <Td>{result.correct ? "⭕" : "❌"}</Td>
              <Td>{result.word.word}</Td>
              <Td>{result.word.meaning}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
      <Button as={RouterLink} to="/main/grammar/ai" colorScheme="blue" m={2}>
        스크립트로 공부하러 가기
      </Button>
      <Button as={RouterLink} to="/main/word" colorScheme="green" m={2} onClick={() => window.location.reload()}>
        단어학습 더 하기
      </Button>
      <Button as={RouterLink} to="/main" colorScheme="red" m={2}>
        학습 끝내기
      </Button>
    </Box>
  );
};

export default ResultPage;