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
import CustomNoteAdd from "./Components/AddCustomNote";
import * as type from "../../apis/types/custom";
import {
  postCustomNote,
  putCustomNote,
  postCustomWord,
  putCustomWord,
  getNoteDetail,
} from "../../apis/customWord";
import WordBox from "./Components/WordBox";

/** 단어 하나가 추가되면 편집 창이 생기는 로직만들어야함 */
export default function CustomNoteAddPage() {
  const [empty, setEmpty] = useState(false);
  const [disable, setDisable] = useState(false);
  const [isEditing, setIsEditing] = useState(true);
  const [title, setTitle] = useState("");
  const [userCustomWord, setUserCustomWord] = useState<type.SubmitCustomWord>({
    word: "",
    meaning: "",
  });
  const [word, setWord] = useState("");
  const [getCustomWord, setGetCustomWord] = useState();

  const refreshWords = () => {};

  async function fetchNewCustomNote(data) {
    const res = await postCustomNote(data);
    console.log("단어장 생성");
    console.log(res);
    setTitle(res.data);
  }

  const fetchWord = (data) => {
    const res = postCustomWord("?s", data);
  };
  /**단어 업데이트 될때 목록 출력하는 api */
  useEffect(() => {
    const data = getNoteDetail(`?book=custom&customBookId="${getCustomWord}"`);
  }, []);
  console.log("-------이건 뭐지?---------");
  console.log(word);

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
            <Input //왜 입력이 안되징?
              type="text"
              placeholder="단어장 이름"
              value={title}
              disabled={disable}
              onChange={(e) => {
                e.preventDefault();
                setDisable(false);
                setTitle(title);
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
