import {
  Flex,
  Box,
  FormControl,
  Input,
  Stack,
  HStack,
  Text,
  Button,
  Heading,
  useColorModeValue,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { isStringLiteral } from "typescript";
import customWord from "../../apis/customWord";

interface SubmitCustomWord {
  word: string;
  meaning: string;
}
/** 단어하나가 추가되면 편집 창이 생기는 로직만들어야함 */
export default function CustomNoteAddPage() {
  const [disable, setDisable] = useState(true);
  const [isEditing, setIsEditing] = useState(true);
  const [userCustomWord, setUserCustomWord] = useState<SubmitCustomWord>({
    word: "",
    meaning: "",
  });

  const [getCustomWord, setGetCustomWord] = useState();

  /**단어 추가하는 api */
  customWord.createCustomWordInBook;

  /**단어 업데이트 될때 목록 출력하는 api */
  useEffect(() => {
    const data = customWord.getBook(`?book={custom}&customBookId="${getCustomWord}"`);
  }, []);

  return (
    <Flex
      minH={"100vh"}
      align={"center"}
      justify={"center"}
      bg={useColorModeValue("gray.50", "gray.800")}
    >
      <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
        <Stack align={"center"}>
          <Heading fontSize={"4xl"}>단어 추가하기</Heading>
        </Stack>
        <Box
          rounded={"lg"}
          bg={useColorModeValue("white", "gray.700")}
          boxShadow={"lg"}
          p={8}
          w="360px"
        >
          <FormControl id="custom-book">
            <Input
              type="text"
              placeholder="단어장 이름"
              disabled={disable}
              onChange={(e) => {
                e.preventDefault();
                setDisable(false);
              }}
            />
          </FormControl>
        </Box>
        {isEditing && (
          <Box
            rounded={"lg"}
            bg={useColorModeValue("white", "gray.700")}
            boxShadow={"lg"}
            p={8}
            w="360px"
          >
            <Stack spacing={4}>
              <FormControl id="word">
                <Input type="text" placeholder="영어 단어" value={userCustomWord.word} />
              </FormControl>
              <FormControl id="mean">
                <Input type="text" placeholder="단어 뜻" value={userCustomWord.meaning} />
              </FormControl>
              <Stack spacing={10}>
                <Stack
                  direction={{ base: "column", sm: "row" }}
                  align={"start"}
                  justify={"space-between"}
                ></Stack>
                <Button colorScheme="teal" color={"white"} variant="solid">
                  ✚
                </Button>
              </Stack>
            </Stack>
          </Box>
        )}
        {!isEditing && (
          <Box
            rounded={"lg"}
            bg={useColorModeValue("white", "gray.700")}
            boxShadow={"lg"}
            p={8}
            w="360px"
          >
            <Stack spacing={4}>
              <FormControl id="word">
                <Text>{"영어단어"}</Text>
              </FormControl>
              <FormControl id="mean">
                <Text>{"영어단어 뜻"}</Text>
              </FormControl>
            </Stack>
          </Box>
        )}
      </Stack>
    </Flex>
  );
}
