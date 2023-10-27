import React, { useEffect, useState } from "react";
import { useToast, Checkbox, Button, Box, Table, Thead, Tbody, Tr, Th, Td, Text } from "@chakra-ui/react";
import { FetchStudyWords } from "../apis/studyWord";
import { useNavigate } from 'react-router-dom';

const ResultPage = () => {
  const [resultData, setResultData] = useState([]);
  const [checkedWords, setCheckedWords] = useState({});
  const [checkedCount, setCheckedCount] = useState(0);

  const navigate = useNavigate();
  const toast = useToast();

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

  const handleSendCheckedWords = () => {
    const selectedWords = {};
    for (const result of resultData) {
      if (checkedWords[result.word.word]) {
        selectedWords[result.word.word] = result.word.meaning;
      }
    }
    navigate('/main/paramTestGptWordPage', { state: { receivedWords: selectedWords } });
  };

  const toggleCheckbox = (word) => {
    setCheckedWords(prevState => {
      const newCheckedWords = { ...prevState, [word]: !prevState[word] };
      const newCount = Object.values(newCheckedWords).filter(Boolean).length;

      if (newCount <= 3) {
        setCheckedCount(newCount);
        return newCheckedWords;
      } else {
        toast({
          title: "Limit Reached",
          description: "3개까지만 선택할 수 있어요",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return prevState;
      }
    });
  };

  return (
    <Box>
      <Button onClick={handleSendCheckedWords} isDisabled={checkedCount === 0}>
        선택된 단어 전달
      </Button>
      <Text fontSize="lg" mb={2}>
        {checkedCount} 개 선택됨
      </Text>

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
              <Td><Checkbox isChecked={checkedWords[result.word.word] || false} onChange={() => toggleCheckbox(result.word.word)} /></Td>
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
