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
import * as Api from "../../apis/customWord";
import CustomNoteAdd from "./Components/AddCustomNote";
import * as type from "../../apis/types/custom";

/** 단어 하나가 추가되면 편집 창이 생기는 로직만들어야함 */
export default function CustomNoteAddPage() {
  const [empty, setEmpty] = useState(false);
  const [disable, setDisable] = useState(true);
  const [isEditing, setIsEditing] = useState(true);
  const [userCustomWord, setUserCustomWord] = useState<type.SubmitCustomWord>({
    word: "",
    meaning: "",
  });
  const [word, setWord] = useState("");
  const [getCustomWord, setGetCustomWord] = useState();

  const refreshWords = () => {};

  /**단어 업데이트 될때 목록 출력하는 api */
  useEffect(() => {
    const data = Api.getNoteDetail(`?book=custom&customBookId="${getCustomWord}"`);
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
        <CustomNoteAdd
          isEditing={isEditing}
          userCustomWord={userCustomWord}
          // key={word.id}
          word={word}
          setWord={setWord}
          refresh={refreshWords}
        />
      </Stack>
    </Flex>
  );
}
