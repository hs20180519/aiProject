import { Box, ButtonGroup, Input, Stack, Text, useColorModeValue } from "@chakra-ui/react";
import { useState } from "react";
import Btn from "../../../components/Btn";
import { Word } from "../AddCustomNotePage";
import * as type from "../../../apis/types/custom";

import { putCustomWord, delCustomWord } from "../../../apis/customWord";

interface CustomWordBoxProps {
  word: Word;
  onUpdate: (id: number, data: type.SubmitCustomWord) => void | Promise<void>;
  onDelete: (id: number) => void | Promise<void>;
}

export default function CustomWordBox({ word, onDelete, onUpdate }: CustomWordBoxProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [updateWord, setUpdateWord] = useState(word.word);
  const [updateMeaning, setUpdateMeaning] = useState(word.meaning);

  const handleUpdate = () => {
    onUpdate(word.id, { word: updateWord, meaning: updateMeaning });
    setIsEditing(false);
  };

  const handleDelete = () => {
    onDelete(word.id);
    setIsEditing(false);
  };

  return (
    <>
      {isEditing ? (
        <>
          <Box
            rounded={"lg"}
            bg={useColorModeValue("white", "gray.700")}
            boxShadow={"lg"}
            p={8}
            w="360px"
          >
            <Stack spacing={4}>
              <Input value={updateWord} onChange={(e) => setUpdateWord(e.target.value)} />
              <Input value={updateMeaning} onChange={(e) => setUpdateMeaning(e.target.value)} />
            </Stack>
            <ButtonGroup mt={5}>
              <Btn text="저장" onClick={handleUpdate} />
              <Btn text="삭제" color="rad" onClick={handleDelete} />
            </ButtonGroup>
          </Box>
        </>
      ) : (
        <Box
          rounded={"lg"}
          bg={useColorModeValue("white", "gray.700")}
          boxShadow={"lg"}
          p={8}
          w="360px"
          position={"relative"}
        >
          <Stack spacing={4}>
            <Text>단어: {word.word}</Text>
            <Text>뜻: {word.meaning}</Text>
          </Stack>
          <Box position={"absolute"} right="12px" bottom="12px">
            <Btn text="단어 편집" onClick={() => setIsEditing((prev) => !prev)} />
          </Box>
        </Box>
      )}
    </>
  );
}
