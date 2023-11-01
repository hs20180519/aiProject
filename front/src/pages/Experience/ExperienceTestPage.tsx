import React, { useState, useEffect } from "react";
import { Box, Button, Flex, Text } from "@chakra-ui/react";
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@chakra-ui/react";
import { FetchExperience } from "../../apis/experience";

interface WordData {
  id: number;
  word: string;
  meaning: string;
  category: string;
  choices: string[];
}

interface Answer {
  id: number;
  word: string;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
}

interface ExperienceTestPageProps {
    setShowExperienceResultPage: (value: boolean) => void;
    setCollectAnswers: (answers: Answer[]) => void;
  }

const PopupModal = ({ isOpen, onClose, isCorrect, correctAnswer }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered={true}>
      <ModalOverlay />
      <ModalContent maxW="343px" display="flex" flexDirection="column" alignItems="center" justifyContent="center">
        <ModalHeader>
          {isCorrect ? "정답" : "오답"}
        </ModalHeader>
        <ModalBody>
          {isCorrect ? "정답입니다!" : `틀렸습니다. 정답은: ${correctAnswer}`}
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="teal" onClick={onClose}>
            확인
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

const ExperienceTestPage: React.FC<ExperienceTestPageProps> = ({ setShowExperienceResultPage, setCollectAnswers }) => {
  const [wordData, setWordData] = useState<WordData[]>([]);
  const [popupIsOpen, setPopupIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answerState, setAnswerState] = useState({
    answers: [] as Answer[],
    popupCorrectAnswer: "",
    popupIsCorrect: false,
  });

  const fetchWords = async () => {
    try {
      const response = await FetchExperience.getExperienceEdu();
      const newWordData = response.data;
      setWordData(newWordData);
    } catch (error) {
      console.error('Error fetching words:', error);
    }
  };

  const handleChoiceClick = (choice: string) => {
    const userAnswer = choice;
    const correctAnswer = wordData[currentIndex].meaning;
    const isCorrect = userAnswer === correctAnswer;
    const newAnswer: Answer = {
      id: wordData[currentIndex].id,
      word: wordData[currentIndex].word,
      userAnswer,
      correctAnswer,
      isCorrect,
    };

    setAnswerState({
      answers: [...answerState.answers, newAnswer],
      popupCorrectAnswer: correctAnswer,
      popupIsCorrect: isCorrect,
    });
    setPopupIsOpen(true);
  };

  const handleDontKnow = () => {
    const correctAnswer = wordData[currentIndex].meaning;
    const newAnswer: Answer = {
      id: wordData[currentIndex].id,
      word: wordData[currentIndex].word,
      userAnswer: null,
      correctAnswer,
      isCorrect: false,
    };

    setAnswerState({
      answers: [...answerState.answers, newAnswer],
      popupCorrectAnswer: correctAnswer,
      popupIsCorrect: false,
    });
    setPopupIsOpen(true);
  };

  const handleModalClose = () => {
    setPopupIsOpen(false);
  
    if (currentIndex < 9) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCollectAnswers(answerState.answers);
      setShowExperienceResultPage(true);
    }
  };

  useEffect(() => {
    fetchWords();
  }, []);

  const currentWordSet = wordData[currentIndex];
  const currentWord = currentWordSet?.word;
  const currentChoices = currentWordSet?.choices || [];
  const totalWords = wordData.length;

  return (
    <Flex align="center" justify="center" height="100vh">
      <Box width="330px" borderWidth={1} borderRadius="lg">
        <Text fontSize="xl" fontWeight="bold" m={4}>
          🐾Wordy
        </Text>
        <Text fontSize="5xl" fontWeight="bold" mb={2} textAlign="center">
          {currentWord}
        </Text>
        <Flex flexWrap="wrap" direction="column" align="center">
          {currentChoices.map((choice) => (
            <Flex key={choice} my={2} justify="center">
              <Button
                colorScheme="teal"
                onClick={() => handleChoiceClick(choice)}
                size="md"
              >
                {choice}
              </Button>
            </Flex>
          ))}
        </Flex>
        <Flex justify="center" align="center" mt={2}>
          <Button
            variant="outline"
            onClick={handleDontKnow}
            colorScheme="orange"
            size="md"
          >
            모르겠어요🤔
          </Button>
        </Flex>
        <Flex justify="center" align="center" mt={4} mb={2}>
          <Text fontSize="sm" textAlign="center">
            {currentIndex + 1}/{totalWords}
          </Text>
        </Flex>
        <PopupModal
          isOpen={popupIsOpen}
          onClose={handleModalClose}
          isCorrect={answerState.popupIsCorrect}
          correctAnswer={answerState.popupCorrectAnswer}
        />
      </Box>
    </Flex>
  );
};

export default ExperienceTestPage;