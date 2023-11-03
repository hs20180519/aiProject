import React, { useState, useEffect } from "react";
import { Box, Button, Flex, Text } from "@chakra-ui/react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@chakra-ui/react";
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

const PopupModal = ({ isOpen, onClose, isCorrect, correctAnswer }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered={true}>
      <ModalOverlay />
      <ModalContent
        maxW="343px"
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
      >
        <ModalHeader>{isCorrect ? "정답" : "오답"}</ModalHeader>
        <ModalBody>{isCorrect ? "정답입니다!" : `틀렸습니다. 정답은: ${correctAnswer}`}</ModalBody>
        <ModalFooter>
          <Button colorScheme="teal" onClick={onClose}>
            확인
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

const TestPage: React.FC<TestPageProps> = ({ selectedCategory, setShowResultPage }) => {
  const [wordData, setWordData] = useState<WordData>();
  const [popupIsOpen, setPopupIsOpen] = useState(false);
  const [popupIsCorrect, setPopupIsCorrect] = useState(false);
  const [popupCorrectAnswer, setPopupCorrectAnswer] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  const fetchWords = async () => {
    try {
      const queryParams = `book=${selectedCategory}`;
      const response = await FetchStudyWords.getStudyWord(queryParams);
      const newWordData = response.data;
      setWordData(newWordData);
    } catch (error) {
      console.error("Error fetching words:", error);
    }
  };

  const saveLearn = async (wordData, isCorrect) => {
    try {
      FetchStudyWords.saveLearn({
        wordId: wordData.id,
        correct: isCorrect,
      });
    } catch (error) {
      console.error("Error saving learn: ", error);
    }
  };

  const handleChoiceClick = (choice: string) => {
    const userAnswer = choice;
    const correctAnswer = wordData.meaning;
    const isCorrect = userAnswer === correctAnswer;

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
    <Box
      minH="555px"
      background="white"
      borderWidth={1}
      borderRadius="lg"
      p={4}
      alignItems="center"
      justifyContent="center"
    >
      <Text fontSize="xl" fontWeight="bold">
        ✏️단어학습 ({selectedCategory.toUpperCase()})
      </Text>
      <Flex
        minH="438px"
        margin="16px 0"
        direction="column"
        alignItems="center"
        justifyContent="center"
      >
        <Box>
          <Text width="309px" fontSize="5xl" fontWeight="bold" mb={2} textAlign="center">
            {currentWord}
          </Text>
          <Flex flexWrap="wrap" direction="column" align="center">
            {currentChoices.map((choice) => (
              <Flex key={choice} my={2} justify="center">
                <Button colorScheme="teal" onClick={() => handleChoiceClick(choice)} size="md">
                  {choice}
                </Button>
              </Flex>
            ))}
          </Flex>
          <Flex justify="center" align="center" mt={2}>
            <Button variant="outline" onClick={handleDontKnow} colorScheme="orange" size="md">
              모르겠어요🤔
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
      <Flex justify="center" align="center">
        <Text fontSize="sm" textAlign="center">
          {currentIndex + 1}/{totalWords}
        </Text>
      </Flex>
    </Box>
  );
};

export default TestPage;
