import React, { useState } from "react";
import { Button, Flex, Text, Stack } from "@chakra-ui/react";

const CategoryPage = ({ onSelectCategory }) => {
  const categories = ["csat", "toeic", "toefl", "ielts"];
  const [selectedCategory, setSelectedCategory] = useState("");

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  };

  const handleApplyCategory = () => {
    if (selectedCategory) {
      onSelectCategory(selectedCategory);
    }
  };
  console.log(selectedCategory);

  return (
    <Flex direction="column" align="center">
      <Text fontSize="2xl" mb={4} textAlign="center">
        단어학습<br />카테고리 선택
      </Text>
      <Stack spacing={2}>
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? "solid" : "outline"}
            colorScheme="blue"
            onClick={() => handleCategorySelect(category)}
          >
            {category}
          </Button>
        ))}
      </Stack>
      <Button
        onClick={handleApplyCategory}
        colorScheme="green"
        mt={4}
        isDisabled={!selectedCategory}
      >
        선택
      </Button>
    </Flex>
  );
};

export default CategoryPage;