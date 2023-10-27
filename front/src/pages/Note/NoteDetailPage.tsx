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

export default function NoteDetailPage() {
  const { note_id } = useParams();
  const { category } = useParams();

  const [words, setWords] = useState([]);
  const [isEditing, setIsEditing] = useState(false);

  const fetchCustomNoteDetail = async () => {
    try {
      if (category === "custom") {
        // const res = await getNoteDetail(`book=custom&customBookId=${note_id}`);
        const res = await getNoteDetail(`book=toeic`);
        console.log("---------커스텀 단어---------");
        console.log(res.data.words);
        setWords(res.data.words);
      } else if (category !== "custom") {
        const res = await getNoteDetail(`book=${category}`);
        console.log("--------------카테고리----------");
        console.log(res.data);
        setWords(res.data);
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
