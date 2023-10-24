import { Box, Flex, Spacer } from "@chakra-ui/react";

/** 유저가 갖고있는 수 만큼 */
export default function CustomWordList() {
  return (
    <Flex>
      <Box w="200px" h="10" bg="red.500" />
      <Spacer />
      <Box w="200px" h="10" bg="red.500" />
      <Spacer />
      <Box w="200px" h="10" bg="red.500" />
    </Flex>
  );
}
