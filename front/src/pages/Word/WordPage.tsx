import React, { useState } from "react";
import { Box, ChakraProvider, extendTheme } from "@chakra-ui/react";
import CategoryPage from "./CategoryPage";
import TestPage from "./TestPage";
import ResultPage from "./ResultPage";

const theme = extendTheme({});

export default function WordPage() {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [showTestPage, setShowTestPage] = useState(false);
  const [showResultPage, setShowResultPage] = useState(false);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setShowTestPage(true);
  };

  return (
    <ChakraProvider theme={theme}>
      <Box minH="80vh" display="flex" alignItems="center" justifyContent="center">
        {showTestPage && !showResultPage ? (
          <TestPage selectedCategory={selectedCategory} setShowResultPage={setShowResultPage} />
        ) : showResultPage ? (
          <ResultPage setShowResultPage={setShowResultPage} setShowTestPage={setShowTestPage} />
        ) : (
          <CategoryPage onSelectCategory={handleCategorySelect} />
        )}
      </Box>
    </ChakraProvider>
  );
}
