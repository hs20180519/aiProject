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
import CustomNoteAddCard from "./AddCustomNoteCard.component";

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
        <CustomNoteAddCard isEditing={isEditing} userCustomWord={userCustomWord} />
      </Stack>
    </Flex>
  );
}
