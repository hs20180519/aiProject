import React from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Button,
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Text,
} from "@chakra-ui/react";

interface Answer {
  id: number;
  word: string;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
}

interface ExperienceResultPageProps {
  collectAnswers: Answer[];
}

const ExperienceResultPage: React.FC<ExperienceResultPageProps> = ({ collectAnswers }) => {
  const totalAnswers = collectAnswers.length;
  const correctAnswers = collectAnswers.filter((result) => result.isCorrect).length;

  return (
    <Box background="white" boxShadow="md" p={6} rounded="md" flexGrow={1} width="100%">
      <Text fontSize="2xl" fontWeight="bold" mb={4}>
        단어 학습 결과 (정답 개수 {correctAnswers}개 / 총 단어 개수 {totalAnswers}개)
      </Text>
      <Box border="1px" borderRadius="md" borderColor="gray.200" overflow="auto" p="6" m="2">
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
            {collectAnswers.map((result, index) => (
              <Tr key={index}>
                <Td>{index + 1}</Td>
                <Td>{result.isCorrect ? "⭕" : "❌"}</Td>
                <Td>{result.word}</Td>
                <Td>{result.correctAnswer}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>

      <Box textAlign="center">
        <Button
          as={RouterLink}
          to="/"
          colorScheme="green"
          m={2}
        >
          처음으로 돌아가기
        </Button>
        <Button as={RouterLink} to="/signup" colorScheme="red" m={2}>
          회원가입 하러가기
        </Button>
      </Box>
    </Box>
  );
};

export default ExperienceResultPage;
