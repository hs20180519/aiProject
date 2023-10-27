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
import * as Api from "../../apis/customWord.controller";

const NOTE_LIST = [
  { id: "correct", title: "학습한 단어" },
  { id: "incorrect", title: "틀린 단어" },
  { id: "csat", title: "수능" },
  { id: "toeic", title: "TOEIC" },
  { id: "toefl", title: "TOEPL" },
  { id: "ielts", title: "IELTS" },
];

export default function CustomNoteListPage() {
  const [wordList, setWordList] = useState(NOTE_LIST);
  const [customNoteList, setCustomNoteList] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [checkedItems, setCheckedItems] = useState([false, false]);
  const allChecked = checkedItems.every(Boolean);

  async function getNoteList() {
    const res = await Api.fetchCustomNotes();
    console.log(res);
    // setCustomNoteList();
  }
  useEffect(() => {
    getNoteList();
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
        {/* 학습한 단어장 및 DB 단어장 목록 */}
        <NoteListBox noteList={wordList} isEditing={isEditing} />
        {/* 유저가 추가한 단어장 목록 */}
        <NoteListBox noteList={customNoteList} isEditing={isEditing} />
      </SimpleGrid>
    </>
  );
}
