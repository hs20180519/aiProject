import { Box, Text, useColorModeValue, VStack, StackDivider, Stack } from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";
import * as type from "../../../apis/types/custom";
import styled from "@emotion/styled";
import BookmarkBtn from "../../../components/BookmarkBtn";

/** 단어와 뜻을 표시하는 상자입니다. */
export default function WordBox({ words, isEditing, isBookmarked }) {
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
          <Stack direction="row" mt={-3}>
            <Text fontSize="xl" right={24}>
              {word.word}
            </Text>
            <Text fontSize="xl" position={"absolute"} right={24}>
              {word.meaning}
            </Text>
            <BookmarkBtn isBookmarked={isBookmarked} />
          </Stack>
        </Box>
      ))}
    </VStack>
  );
}
