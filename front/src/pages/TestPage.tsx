/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from "react";
import { Box, Button, Flex, Text } from "@chakra-ui/react";
// import axios from "axios";
// import { FetchStudyWords } from "../apis/studyWord";
// import WordCard from "../components/WordCard";
// import MoveButton from "../components/MoveButton";

interface WordData {
  englishWord: string;
  koreanMeaning: string;
}

interface TestPageProps {}

const shuffleArray = (array: string[]) => {
  const shuffledArray = [...array];
  // eslint-disable-next-line no-plusplus
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }
  return shuffledArray;
};

const TestPage: React.FC<TestPageProps> = () => {
  const [wordData, setWordData] = useState<WordData[]>([]);
  const [options, setOptions] = useState<string[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  useEffect(() => {
    const fetchWords = async () => {
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
        "레몬", "라임", "키위", "블루베리", "매실",
        "귤", "마늘", "감", "멜론", "토마토",
        "아보카도", "참외", "한라봉", "두리안", "은행",
        "자몽", "석류", "방울토마토", "체리토마토", "배",
        "파파야", "코코넛", "블랙베리", "라즈베리", "패션프루트",
        "밤", "낑깡", "호박", "앵두", "아사이베리",
        "자두", "샤인머스캣", "모과", "크랜베리", "아몬드",
        "천도복숭아", "잣", "애호박", "레드향", "산딸기"
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
  const currentWordKoreanMeaning = currentWord?.koreanMeaning;
  const shuffledOptions = shuffleArray(options);
  

  return (
    <Flex align={"center"} justify={"center"} height={"100vh"}>
      <Box maxW={"sm"} p={4} borderWidth={1} borderRadius={"lg"}>
        <Text fontSize={"xl"} fontWeight={"bold"} mb={4}>
          {"Wordy\r"}
        </Text>
        <Text fontSize={"2xl"} mb={4}>
          {currentWord?.englishWord}
        </Text>
        {shuffledOptions.slice(currentWordIndex * 4, currentWordIndex * 4 + 4).concat(currentWordKoreanMeaning).map(option => (
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