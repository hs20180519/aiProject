import React, { useEffect, useState } from "react";
import { Box, Table, Thead, Tbody, Tr, Th, Td, Text } from "@chakra-ui/react";
import { FetchStudyWords } from "../apis/studyWord";

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
        결과 ({correctAnswers} / {totalAnswers})
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
              <Td>{result.correct ? "🐾" : "☠️"}</Td>
              <Td>{result.word.word}</Td>
              <Td>{result.word.meaning}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export default ResultPage;