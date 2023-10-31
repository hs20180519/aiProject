// InnerPage.js
import React, { useState } from "react";
import { Box, ChakraProvider, extendTheme } from "@chakra-ui/react";
import ExperienceTestPage from "./ExperienceTestPage";
import ExperienceResultPage from "./ExperienceResultPage";

const theme = extendTheme({});

interface Answer {
  id: number;
  word: string;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
}

export default function ExperiencePage() {
  const [showExperienceResultPage, setShowExperienceResultPage] = useState(false);
  const [collectAnswers, setCollectAnswers] = useState<Answer[]>([]);
  
  console.log(collectAnswers)

  return (
    <ChakraProvider theme={theme}>
      <div style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        { showExperienceResultPage ? (
          <ExperienceResultPage collectAnswers={collectAnswers} />
        ) : (
          <ExperienceTestPage
            setShowExperienceResultPage={setShowExperienceResultPage}
            setCollectAnswers={(answers) => setCollectAnswers(answers)}
          />
        )}
      </div>
    </ChakraProvider>
  );
}
