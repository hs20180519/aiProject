import { useState, useEffect } from "react";
import NoteListBox from "./Components/NoteListBox";
import {
  useColorModeValue,
  Flex,
  Spacer,
  Box,
  Heading,
  Button,
  Badge,
  SimpleGrid,
  AbsoluteCenter,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import * as Api from "../../apis/customWord";

const NOTE_LIST = [
  { id: "correct", title: "학습한 단어" },
  { id: "incorrect", title: "틀린 단어" },
];

/** 유저가 저장한 단어장 목록을 보여주는 페이지입니다. */
export default function CustomNoteListPage() {
  const [noteList, setNoteList] = useState(NOTE_LIST);
  const [customNoteList, setCustomNoteList] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [checkedItems, setCheckedItems] = useState([false, false]);
  const allChecked = checkedItems.every(Boolean);

  /** 노트 목록 가져오기 */
  async function fetchNoteList() {
    const res = await Api.getCustomNotes();
    console.log(res.data);
    setCustomNoteList(res.data);
  }

  useEffect(() => {
    fetchNoteList();
  }, []);
  return (
    <>
      <Flex minWidth="max-content" alignItems="center" gap="2" mb="5">
        <Box p="2">
          <Heading size="md">내 단어장</Heading>
        </Box>
        <Spacer />
        <Button
          colorScheme={isEditing ? "red" : "teal"}
          onClick={() => setIsEditing((prev) => !prev)}
        >
          {isEditing ? "단어장 삭제" : "단어장 편집"}
        </Button>
      </Flex>

      <SimpleGrid columns={4} spacing={10}>
        <Link to={`/main/note_add`}>
          <Box
            rounded={"lg"}
            bg={useColorModeValue("gray100", "gray.700")}
            boxShadow={"lg"}
            p={8}
            position="relative"
            h="120px"
            borderWidth="3px"
            borderRadius="lg"
          >
            <AbsoluteCenter>
              <Badge
                borderRadius="full"
                px="5"
                colorScheme="teal"
                fontSize="lg"
                letterSpacing="center"
              >
                ✚ 새 단어장
              </Badge>
            </AbsoluteCenter>
          </Box>
        </Link>

        <NoteListBox noteList={noteList} isEditing={isEditing} />
        <NoteListBox noteList={customNoteList} isEditing={isEditing} />
      </SimpleGrid>
    </>
  );
}
