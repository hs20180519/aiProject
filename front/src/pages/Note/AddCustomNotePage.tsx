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
  useToast,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { isStringLiteral } from "typescript";
import CustomWord from "../../apis/customWord";
import CustomNoteAddCard from "./AddCustomNoteCard.component";

interface SubmitCustomWord {
  word: string;
  meaning: string;
}
const TOAST_TIMEOUT_INTERVAL = 700;

/** 단어 하나가 추가되면 편집 창이 생기는 로직만들어야함 */
export default function CustomNoteAddPage() {
  const toast = useToast();
  const [empty, setEmpty] = useState(false);
  const [disable, setDisable] = useState(true);
  const [isEditing, setIsEditing] = useState(true);
  const [userCustomWord, setUserCustomWord] = useState<SubmitCustomWord>({
    word: "",
    meaning: "",
  });

  const [getCustomWord, setGetCustomWord] = useState();

  /** 커스텀 단어장 생성 api */
  const fetchCreateCustomBook = async (title) => {
    try {
      const res = await CustomWord.createCustomBook(title);
      if (res.status === 201) {
        toast({
          title: `새로운 단어장 생성 완료!`,
          status: "success",
          isClosable: true,
          duration: TOAST_TIMEOUT_INTERVAL,
        });
      }
    } catch (e) {
      console.error();
    }
  };
  /**단어 추가하는 api */
  CustomWord.createCustomWordInBook;

  /**단어 업데이트 될때 목록 출력하는 api */
  useEffect(() => {
    const data = CustomWord.getBook(`?book={custom}&customBookId="${getCustomWord}"`);
  }, []);

  return (
    <Flex
      height={"100%"}
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
