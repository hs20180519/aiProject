import React, { useState } from "react";
import { Button, Box, Flex, Text, Stack } from "@chakra-ui/react";
import { useNavigate } from "react-router";

const CategoryPage = ({ onSelectCategory }) => {
  const navigate = useNavigate();
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

  return (
    <Box
      height="555px"
      width="359px"
      background="white"
      borderWidth={1}
      borderRadius="lg"
      p={4}
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <Flex direction="column" align="center">
        <Text fontSize="3xl" mb={4} textAlign="center">
          단어 학습
          <br />
          카테고리 선택
        </Text>
        <Stack spacing={3}>
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "solid" : "outline"}
              colorScheme="teal"
              onClick={() => handleCategorySelect(category)}
            >
              {category.toUpperCase()}
            </Button>
          ))}
          <Button colorScheme="teal" onClick={() => navigate("/main/custom")}>
            내 단어장으로 학습하기
          </Button>
        </Stack>
        <Button
          onClick={handleApplyCategory}
          colorScheme="orange"
          mt={4}
          isDisabled={!selectedCategory}
        >
          선택
        </Button>
      </Flex>
    </Box>
  );
};

export default CategoryPage;
