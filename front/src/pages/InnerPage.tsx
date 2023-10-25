// InnerPage.js
import React, { useState } from "react";
import { Box, ChakraProvider, extendTheme } from "@chakra-ui/react";
import CategoryPage from "./CategoryPage";
import TestPage from "./TestPage";
import ResultPage from "./ResultPage";

const theme = extendTheme({});

export default function InnerPage() {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [showTestPage, setShowTestPage] = useState(false);
  const [showResultPage, setShowResultPage] = useState(false);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setShowTestPage(true);
  };

  return (
    <ChakraProvider theme={theme}>
      <Box minH="100vh" display="flex" alignItems="center" justifyContent="center">
        {showTestPage && !showResultPage ? ( // Render TestPage or ResultPage based on state
          <TestPage
            selectedCategory={selectedCategory}
            setShowResultPage={setShowResultPage} // Pass setShowResultPage to TestPage
          />
        ) : showResultPage ? ( // Render ResultPage if showResultPage is true
          <ResultPage />
        ) : (
          // Render the CategorySelection component
          <CategoryPage onSelectCategory={handleCategorySelect} />
        )}
      </Box>
    </ChakraProvider>
  );
}
