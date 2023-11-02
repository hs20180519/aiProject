import React from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Button,
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
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
    <Box background="white" boxShadow="md" p={4} rounded="md" flexGrow={1} width="100%">
  <Text fontSize="lg" fontWeight="bold" mb={4}>
    🐾체험 학습 결과 <br /> (정답 개수 {correctAnswers}개 / 총 단어 개수 {totalAnswers}개)
  </Text>
  <Box border="1px" borderRadius="md" borderColor="gray.200" overflow="auto" p="1" m="1">
    <Table>
      <Thead>
        <Tr>
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
        {collectAnswers.map((result, index) => (
          <Tr key={index}>
            <Td  p="0.2rem" textAlign="center">{index + 1}</Td>
            <Td  p="0.2rem" textAlign="center">{result.isCorrect ? "⭕" : "❌"}</Td>
            <Td  p="0">
              <Table>
                <Tr>
                  <Td  p="0.2rem" textAlign="center">{result.word}</Td>
                </Tr>
                <Tr>
                  <Td  p="0.2rem" textAlign="center">{result.correctAnswer}</Td>
                </Tr>
              </Table>
            </Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  </Box>

  <Box textAlign="center">
    <Button
      as={RouterLink}
      to="/"
      colorScheme="teal"
      m={2}
    >
      처음으로 돌아가기
    </Button>
    <Button as={RouterLink} to="/signup" colorScheme="orange" m={2}>
      회원가입 하러가기
    </Button>
  </Box>
</Box>
  );
};

export default ExperienceResultPage;
