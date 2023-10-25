// InnerPage.js
import React, { useState } from "react";
import { Box, ChakraProvider, extendTheme } from "@chakra-ui/react";
import CategoryPage from "./CategoryPage";
import TestPage from "./TestPage";

const theme = extendTheme({});

export default function InnerPage() {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [showTestPage, setShowTestPage] = useState(false);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setShowTestPage(true);
  };

  return (
    <ChakraProvider theme={theme}>
      <Box minH="80vh" display="flex" alignItems="center" justifyContent="center">
        {showTestPage ? (
          // Render the TestPage component with the selected category as a string
          <TestPage selectedCategory={selectedCategory} />
        ) : (
          // Render the CategorySelection component
          <CategoryPage onSelectCategory={handleCategorySelect} />
        )}
      </Box>
    </ChakraProvider>
  );
}
