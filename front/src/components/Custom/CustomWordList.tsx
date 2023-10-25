import { Box, Text, Flex, Center, Spacer, useColorModeValue } from "@chakra-ui/react";
import CustomWord from "../../apis/customWord";

export interface CustomWordProps {
  id: string;
  title: string;
}
export interface CustomWordListProps {
  customWordList: CustomWordProps[];
}

/** 유저가 갖고있는 수 만큼 */
export default function CustomWordList({ customWordList }: CustomWordListProps) {
  return (
    <Flex>
      {customWordList.map((customWord: CustomWordProps) => (
        <Box
          key={customWord.id}
          rounded={"lg"}
          bg={useColorModeValue("white", "gray.700")}
          boxShadow={"lg"}
          p={8}
          w="360px"
        >
          <Center w="100px" bg="green.500">
            <Text id={customWord.id}>{customWord?.title}</Text>
          </Center>
        </Box>
      ))}
    </Flex>
  );
}
