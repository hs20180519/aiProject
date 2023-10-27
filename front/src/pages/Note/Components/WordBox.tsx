import { Box, Text, useColorModeValue, VStack, StackDivider } from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";
import * as type from "../../../apis/types/custom";
import { AiTwotoneStar } from "react-icons/ai";

/** 단어와 뜻을 표시하는 상자입니다. */
export default function WordBox({ words, isEditing }) {
  return (
    <VStack divider={<StackDivider borderColor="gray.200" />} spacing={4} align="stretch">
      {words.map((word: type.WordsProps) => (
        <Box
          fontWeight="semibold"
          rounded={"lg"}
          bg={useColorModeValue("white", "gray.700")}
          boxShadow={"lg"}
          alignItems="center"
          p={8}
          height="30px"
          borderWidth="3px"
          borderRadius="lg"
          id={word.id}
        >
          <Text fontSize="xl">{word.word}</Text>
          <Text fontSize="xl">{word.meaning}</Text>
          <AiTwotoneStar />
        </Box>
      ))}
    </VStack>
  );
}
