import { Box, Text, useColorModeValue, Stack, Input, ButtonGroup, Icon } from "@chakra-ui/react";
import { FaRobot } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useState } from "react";
import * as type from "../../../apis/types/custom";
import BookmarkBtn from "../../../components/BookmarkBtn";
import Btn from "../../../components/Btn";
/** 단어와 뜻을 표시하는 상자입니다. */
export default function WordBox({ word, isBookmarked, onUpdate, onDelete }) {
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
            fontWeight="semibold"
            rounded={"lg"}
            bg={useColorModeValue("white", "gray.700")}
            boxShadow={"lg"}
            alignItems="center"
            p={8}
            height="30px"
            borderWidth="3px"
            borderRadius="lg"
            id={word.id}
          >
            <Stack direction="row" mt={-3}>
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
          fontWeight="semibold"
          rounded={"lg"}
          bg={useColorModeValue("white", "gray.700")}
          boxShadow={"lg"}
          alignItems="center"
          p={8}
          height="30px"
          borderWidth="3px"
          borderRadius="lg"
          id={word.id}
        >
          <Stack direction="row" mt={-3}>
            <Text fontSize="xl" right={24}>
              {word.word}
            </Text>
            <Text fontSize="xl" position={"absolute"} right={24}>
              {word.meaning}
            </Text>
            <Link to={`grammar/${word.word}}`}>
              <Icon as={FaRobot} boxSize={8} />
            </Link>
            {/* <BookmarkBtn isBookmarked={isBookmarked} /> */}
          </Stack>
        </Box>
      )}
    </>
  );
}
