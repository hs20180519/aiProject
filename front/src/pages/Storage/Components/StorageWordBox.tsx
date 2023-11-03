import { Box, Flex, Text, useColorModeValue, Stack, Center } from "@chakra-ui/react";
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
      <Center w="169px">
        <Box textAlign="center">
          <Text fontSize="17px" fontFamily="Elice DX Neolli" fontWeight="bold">
            {word.word}
          </Text>
          <Text color={"gray"}>{word.meaning}</Text>
        </Box>
        <Box position={"absolute"} right={"-1px"} mt={"-60px"}>
          <BookMark
            favorite={word.isFavorite}
            onClick={() => {
              onBookmarkClick(word.id, word.isFavorite);
            }}
          />
        </Box>
      </Center>
    </Flex>
  );
};

export default StorageWordBox;
