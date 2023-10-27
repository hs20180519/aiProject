/* eslint-diabled */
import {
  Box,
  Stack,
  Heading,
  Badge,
  Text,
  Flex,
  Center,
  Spacer,
  useColorModeValue,
  SimpleGrid,
  Checkbox,
  AbsoluteCenter,
} from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import { getNoteDetail } from "../../apis/customWord";
import { useState, useEffect } from "react";
import WordBox from "./Components/WordBox";
import { stringify } from "querystring";

/** 단어 상세보기 페이지입니다. */
export default function NoteDetailPage() {
  const { note_id } = useParams();

  const [words, setWords] = useState([]);
  const [isEditing, setIsEditing] = useState(false);

  /** 카테고리별 단어장 조회하는 함수입니다. */
  const fetchCustomNoteDetail = async () => {
    parseInt(note_id);
    try {
      const id = parseInt(note_id);
      if (!isNaN(id)) {
        const res = await getNoteDetail(`book=custom&customBookId=${note_id}`);
        setWords(res.data.words);
      } else {
        const res = await getNoteDetail(`book=${note_id}`);
        setWords(res.data.words);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchCustomNoteDetail();
  }, []);
  return (
    <Stack>
      <WordBox words={words} isEditing={isEditing} />
    </Stack>
  );
}
