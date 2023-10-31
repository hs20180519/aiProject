import React, { useState, useEffect } from "react";
import { Box, Button, Flex, Text } from "@chakra-ui/react";
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@chakra-ui/react";
import { FetchStudyWords } from "../../apis/studyWord";

interface WordData {
  id: number;
  word: string;
  meaning: string;
  category: string;
  choices: string[];
}

interface TestPageProps {
  selectedCategory: string;
  setShowResultPage: (value: boolean) => void; 
}

interface Answer {
  id: number;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
}

const PopupModal = ({ isOpen, onClose, isCorrect, correctAnswer }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered={true}>
      <ModalOverlay />
      <ModalContent display="flex" flexDirection="column" alignItems="center" justifyContent="center">
        <ModalHeader>
          {isCorrect ? "정답" : "오답"}
        </ModalHeader>
        <ModalBody>
          {isCorrect ? "정답입니다!" : `틀렸습니다. 정답은: ${correctAnswer}`}
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" onClick={onClose}>
            확인
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

const TestPage: React.FC<TestPageProps> = ({ selectedCategory, setShowResultPage }) => {
  const [wordData, setWordData] = useState<WordData>();
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Answer>();
  const [popupIsOpen, setPopupIsOpen] = useState(false);
  const [popupIsCorrect, setPopupIsCorrect] = useState(false);
  const [popupCorrectAnswer, setPopupCorrectAnswer] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  const fetchWords = async () => {
    try {
      const queryParams = `${selectedCategory}=true`;
      const response = await FetchStudyWords.getStudyWord(queryParams);
      const newWordData = response.data;
      setWordData(newWordData);
    } catch (error) {
      console.error('Error fetching words:', error);
    }
  };

  const saveLearn = async (wordData, isCorrect) => {
    try {
      FetchStudyWords.saveLearn({
        wordId: wordData.id,
        correct: isCorrect,
      });
    } catch (error) {
      console.error('Error saving learn: ', error)
    }
  };

  const handleChoiceClick = (choice: string) => {
    const userAnswer = choice;
    const correctAnswer = wordData.meaning;
    const isCorrect = userAnswer === correctAnswer;
    const newAnswer: Answer = {
      id: wordData.id,
      userAnswer,
      correctAnswer,
      isCorrect,
    };

    setAnswers(newAnswer);
    setPopupCorrectAnswer(correctAnswer);
    setPopupIsCorrect(isCorrect);
    setPopupIsOpen(true);
    saveLearn(wordData, isCorrect);
  };

  const handleDontKnow = () => {
    if (!wordData) {
    return;
  }
    const correctAnswer = wordData.meaning;
    const newAnswer: Answer = {
      id: wordData.id,
      userAnswer: null,
      correctAnswer,
      isCorrect: false,
    };

    setAnswers(newAnswer);
    setPopupCorrectAnswer(correctAnswer);
    setPopupIsCorrect(false);
    setPopupIsOpen(true);
    saveLearn(wordData, false);
  };

  const handleModalClose = () => {
    setPopupIsOpen(false);
    
    if (currentIndex === 9) {
      setShowResultPage(true);
    } else {
      fetchWords();
    }

    if (currentIndex < 10) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  useEffect(() => {
    fetchWords();
  }, [selectedCategory]);

  const currentWordSet = wordData;
  const currentWord = currentWordSet?.word;
  const currentChoices = currentWordSet?.choices || [];
  const totalWords = 10;

  return (
    <Flex align="center" justify="center" height="100vh">
      <Box maxW="xl" p={6} borderWidth={1} borderRadius="lg">
        <Text fontSize="xl" fontWeight="bold" mb={4}>
          🐾Wordy
        </Text>
        <Text fontSize="6xl" mb={4} textAlign="center">
          {currentWord}
        </Text>
        <Flex flexWrap="wrap">
          {currentChoices.map((choice) => (
            <Button
              variant={selectedChoice === choice ? "solid" : "outline"}
              colorScheme="blue"
              onClick={() => handleChoiceClick(choice)}
              key={choice}
              mb={4}
              mr={4}
              width="auto"
            >
              {choice}
            </Button>
          ))}
        </Flex>
  
        <Flex justify="space-between" align="center" mt={4}>
          <Text fontSize="sm">
            {currentIndex + 1}/{totalWords} {/* 현재 인덱스 번호와 총 단어 개수 */}
          </Text>
          <Button onClick={handleDontKnow} colorScheme="red" size="sm">
            모르겠어요
          </Button>
        </Flex>
  
        <PopupModal
          isOpen={popupIsOpen}
          onClose={handleModalClose}
          isCorrect={popupIsCorrect}
          correctAnswer={popupCorrectAnswer}
        />
      </Box>
    </Flex>
  );
};

export default TestPage;