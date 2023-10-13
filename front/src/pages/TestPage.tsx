/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from "react";
import { Box, Button, Flex, Text } from "@chakra-ui/react";
// import axios from "axios";
// import WordCard from "../components/WordCard";
// import MoveButton from "../components/MoveButton";

interface WordData {
  englishWord: string;
  koreanMeaning: string;
}

interface TestPageProps {}

const TestPage: React.FC<TestPageProps> = () => {
  const [wordData, setWordData] = useState<WordData[]>([]);
  const [options, setOptions] = useState<string[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  useEffect(() => {
    const fetchWords = async () => {
      // try {
      //   // Fetch 10 English words with Korean meanings
      //   const response = await axios.get<WordData[]>('http://localhost:8000/study/english');
      //   setWordData(response.data);

      //   // Fetch additional 40 Korean meanings for options
      //   const optionsResponse = await axios.get<string[]>('http://localhost:8000/study/korean');
      //   setOptions(optionsResponse.data);
      // } catch (error) {
      //   console.error('Error fetching words:', error);
      // }
      setWordData([
        { englishWord: "Apple", koreanMeaning: "사과" },
        { englishWord: "Banana", koreanMeaning: "바나나" },
        { englishWord: "Orange", koreanMeaning: "오렌지" },
        { englishWord: "Grape", koreanMeaning: "포도" },
        { englishWord: "Strawberry", koreanMeaning: "딸기" },
        { englishWord: "Watermelon", koreanMeaning: "수박" },
        { englishWord: "Pineapple", koreanMeaning: "파인애플" },
        { englishWord: "Mango", koreanMeaning: "망고" },
        { englishWord: "Cherry", koreanMeaning: "체리" },
        { englishWord: "Peach", koreanMeaning: "복숭아" },
      ]);
      setOptions([
        "사과",
        "바나나",
        "오렌지",
        "포도",
        "딸기",
        "수박",
        "파인애플",
        "망고",
        "체리",
        "복숭아",
      ]);
    };

    fetchWords();
  }, []);

  const handleNextWord = () => {
    setCurrentWordIndex(prevIndex => prevIndex + 1);
    setSelectedOption(null);
  };

  const handlePrevWord = () => {
    setCurrentWordIndex(prevIndex => Math.max(0, prevIndex - 1));
    setSelectedOption(null);
  };

  const handleOptionClick = (option: string) => {
    setSelectedOption(option);
  };
  
  const handleComplete = () => {
    const results = wordData.map((word, index) => ({
      englishWord: word.englishWord,
      userAnswer: options[currentWordIndex * 5 + index],
      correctAnswer: word.koreanMeaning,
      isCorrect: options[currentWordIndex * 5 + index] === word.koreanMeaning,
    }));
    console.log('Results:', results);
  
    const correctCount = results.filter(result => result.isCorrect).length;
    alert(`You got ${correctCount} out of 10 correct!`);
  };
  const currentWord = wordData[currentWordIndex];

  return (
    <Flex align={"center"} justify={"center"} height={"100vh"}>
      <Box maxW={"sm"} p={4} borderWidth={1} borderRadius={"lg"}>
        <Text fontSize={"xl"} fontWeight={"bold"} mb={4}>
          {"Wordy\r"}
        </Text>
        <Text fontSize={"2xl"} mb={4}>
          {currentWord?.englishWord}
        </Text>
        {options.slice(currentWordIndex * 5, currentWordIndex * 5 + 5).map(option => (
          <Button
            key={option}
            variant={selectedOption === option ? "solid" : "outline"}
            colorScheme={"blue"}
            onClick={() => handleOptionClick(option)}
            mr={2}
            mb={2}
            width={"auto"}
          >
            {option}
          </Button>
        ))}

    <Flex justify={"space-between"} mt={4}>
      <Button onClick={handlePrevWord} disabled={currentWordIndex === 0}>
        {"이전\r"}
      </Button>
      {currentWordIndex === 9 ? (
        <Button colorScheme={"green"} onClick={handleComplete} mt={4}>
          {"완료\r"}
        </Button>
      ) : (
        <Button onClick={handleNextWord}>
          {"다음\r"}
        </Button>
      )}
    </Flex>
          </Box>
        </Flex>
      );
    };

export default TestPage;