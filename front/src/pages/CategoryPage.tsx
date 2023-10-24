import React, { useState } from "react";
import { Button, Flex, Text } from "@chakra-ui/react";

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
      <Text fontSize="2xl" mb={4}>
        카테고리 선택
      </Text>
      {categories.map((category) => (
        <Button
          key={category}
          variant={selectedCategory === category ? "solid" : "outline"}
          colorScheme="blue"
          onClick={() => handleCategorySelect(category)}
          mb={2}
        >
          {category}
        </Button>
      ))}
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
