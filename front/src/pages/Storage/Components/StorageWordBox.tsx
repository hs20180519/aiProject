import { Box, Flex, Text, useColorModeValue, Stack } from "@chakra-ui/react";
import BookMark from "../../../components/BookMark";

const StorageWordBox = ({ word, onBookmarkClick }) => {
  return (
    <Flex
      bg={useColorModeValue("white", "gray.700")}
      h={"100px"}
      borderRadius="lg"
      boxShadow={"lg"}
      position={"relative"}
      alignItems={"center"}
    >
      <Stack>
        <Box textAlign="center" ml={"49px"}>
          <Text fontSize="17px" fontWeight="bold">
            {word.word}
          </Text>
          <Text color={"gray"}>{word.meaning}</Text>
        </Box>
        <Box position={"absolute"} right={"0px"} mt={"-25"}>
          <BookMark
            favorite={word.isFavorite}
            onClick={() => {
              onBookmarkClick(word.id, word.isFavorite);
            }}
          />
        </Box>
      </Stack>
    </Flex>
  );
};

export default StorageWordBox;
//position={"absolute"} right={"1px"}
