import {
  Flex,
  Box,
  FormControl,
  Input,
  Stack,
  HStack,
  Spacer,
  Heading,
  useColorModeValue,
  VStack,
  StackDivider,
  useToast,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import AddCustomNote from "./Components/AddCustomNote";
import * as type from "../../apis/types/custom";
import {
  putCustomNoteTitle,
  postCustomWordAdd,
  putCustomWord,
  getNoteDetail,
  delCustomWord,
  delCustomNote,
} from "../../apis/customWord";

import Btn from "../../components/Btn";
import WordBox from "./Components/WordBox";
import CustomWordBox from "./Components/CustomWordBox";

const TOAST_TIMEOUT_INTERVAL = 700;

type Category = "correct" | "incorrect" | "csat" | "toeic" | "toefl" | "customs";
export interface Word {
  category: Category;
  customBookId: number;
  id: number;
  meaning: string;
  word: string;
  createdAt: string;
  updatedAt: string;
}

export default function CustomNoteAddPage() {
  const { note_id } = useParams();
  const navigate = useNavigate();

  const toast = useToast();

  const [disable, setDisable] = useState(false);
  const [isItAdd, setIsItAdd] = useState(false);
  const [titleIsEditing, setTitleIsEditing] = useState(true);
  const [title, setTitle] = useState("");

  const [customWord, setCustomWord] = useState<type.SubmitCustomWord>({
    word: "",
    meaning: "",
  });

  /** 추가한 단어목록 받아오기 */
  const [words, setWords] = useState<Word[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCustomWord({ ...customWord, [name]: value });
  };

  /**
   * 해당 단어장의 상세정보를 가져오는 함수
   */
  const fetchNoteDetail = async () => {
    try {
      const queryString = `book=customs&page=&limit&customBookId=${note_id}`;
      const res = await getNoteDetail(queryString);
      console.log(res.data);
      if (res.status === 200) {
        setTitle(res.data.title);
        setWords(res.data.words);
      }
    } catch (e) {
      console.log(e);
    }
  };

  /** 단어장 이름 변경 */
  const fetchUpdateNoteTitle = async () => {
    const data = { title };
    try {
      const res = await putCustomNoteTitle(data, note_id);

      if (res.status === 200) {
        toast({
          title: `변경 완료!`,
          status: "success",
          isClosable: true,
          duration: TOAST_TIMEOUT_INTERVAL,
        });
        setTitleIsEditing(false);
      }
    } catch (e) {
      console.error(e);
    }
  };

  /** 단어추가 */
  const fetchWordAdd = async () => {
    try {
      const res = await postCustomWordAdd(`customBookId=${note_id}`, customWord);
      if (res.status === 201) {
        toast({
          title: "단어 추가 완료!",
          status: "success",
          isClosable: true,
          duration: TOAST_TIMEOUT_INTERVAL,
        });
        setCustomWord({ word: "", meaning: "" });
        fetchNoteDetail();
        setIsItAdd(false);
      }
    } catch (e) {
      toast({
        title: "이미 추가된 단어 또는 잘못된 요청입니다.",
        status: "warning",
        isClosable: true,
        duration: TOAST_TIMEOUT_INTERVAL,
      });
    }
  };

  /** 단어장 삭제 */
  const fetchDeleteNote = async () => {
    try {
      const res = await delCustomNote(`customBookId=${note_id}`);
      if (res.status === 200) {
        toast({
          title: "단어장 삭제완료!",
          status: "success",
          isClosable: true,
          duration: TOAST_TIMEOUT_INTERVAL,
        });
        navigate("/main/notes");
      }
    } catch (e) {
      console.log(e);
    }
  };

  /** 단어를 수정
   * @word_id 수정할 단어의 id
   */
  const fetchEditWord = async (word_id: number, data: type.SubmitCustomWord) => {
    try {
      const res = await putCustomWord(`customBookId=${note_id}&wordId=${word_id}`, data);
      if (res.status === 200) {
        console.log("단어 수정완료");
        fetchNoteDetail();
      }
    } catch (e) {
      console.error(e);
    }
  };

  /** 단어를 삭제
   * @word_id 삭제 단어의 id
   */
  const fetchDeleteWord = async (word_id: number) => {
    const url = `customBookId=${note_id}&wordId=${word_id}`;
    try {
      const res = await delCustomWord(url);

      if (res.status === 200) {
        toast({
          title: `삭제되었습니다.`,
          status: "warning",
          isClosable: true,
          duration: TOAST_TIMEOUT_INTERVAL,
        });
        fetchNoteDetail();
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchNoteDetail();
  }, []);

  return (
    <>
      <Flex minWidth="max-content" alignItems="center" gap="2" mb="5">
        <Btn text="단어장 삭제" colorScheme="red" onClick={fetchDeleteNote} />
        <Spacer />
        <Btn text="단어장 생성 완료" onClick={() => navigate("/main/notes")} />
      </Flex>
      <Flex
        height={"100%"}
        align={"center"}
        justify={"center"}
        bg={useColorModeValue("gray.50", "gray.800")}
      >
        <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
          <Stack align={"center"}>
            <Heading fontSize={"4xl"} color={"gray.500"} fontFamily={"Elice DX Neolli"}>
              단어 추가하기
            </Heading>
          </Stack>
          <Box
            rounded={"lg"}
            bg={useColorModeValue("white", "gray.700")}
            boxShadow={"lg"}
            p={8}
            w="360px"
          >
            <FormControl id="custom-book">
              <HStack spacing={2}>
                <Input
                  id="title"
                  type="text"
                  placeholder="단어장 이름"
                  value={title}
                  isDisabled={disable}
                  onChange={(e) => {
                    setTitle(e.target.value);
                  }}
                />
                <Btn
                  text={titleIsEditing ? `저장` : `수정`}
                  onClick={() => {
                    if (titleIsEditing) fetchUpdateNoteTitle();
                    setDisable((prev) => !prev);
                    setTitleIsEditing((prev) => !prev);
                  }}
                />
              </HStack>
            </FormControl>
          </Box>
          <AddCustomNote
            isItAdd={isItAdd}
            setIsItAdd={setIsItAdd}
            customWord={customWord}
            onClick={fetchWordAdd}
            onChange={handleChange}
          />
          <VStack divider={<StackDivider borderColor="gray.200" />} spacing={4} align="stretch">
            {words.map((word: Word) => (
              <CustomWordBox word={word} onUpdate={fetchEditWord} onDelete={fetchDeleteWord} />
            ))}
          </VStack>
        </Stack>
      </Flex>
    </>
  );
}
