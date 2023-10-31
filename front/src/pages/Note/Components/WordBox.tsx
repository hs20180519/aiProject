import {
  Box,
  Text,
  useColorModeValue,
  Stack,
  Input,
  ButtonGroup,
  Icon,
  InputGroup,
  InputLeftElement,
} from "@chakra-ui/react";
import { FaRobot, FaSortAlphaUp, FaDog, FaPencilAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useState } from "react";
import * as type from "../../../apis/types/custom";
import Btn from "../../../components/Btn";

interface WordBoxProps {
  word: type.WordsProps;
  isBookmarked: boolean;
  onUpdate: (word_id: number, data: type.SubmitCustomWord) => void | Promise<void>;
  onDelete: (word_id: number) => void | Promise<void>;
}

/** 단어와 뜻을 표시하는 상자입니다. */
export default function WordBox({ word, isBookmarked, onUpdate, onDelete }: WordBoxProps) {
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
            height="130px"
            borderWidth="3px"
            borderRadius="lg"
            id={word.id.toString()}
          >
            <Stack direction="row" mt={-5}>
              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <Icon as={FaSortAlphaUp} color="gray.300" boxSize={6} />
                </InputLeftElement>
                <Input value={updateWord} onChange={(e) => setUpdateWord(e.target.value)} />
              </InputGroup>
              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <Icon as={FaDog} color="gray.300" boxSize={6} />
                </InputLeftElement>
                <Input value={updateMeaning} onChange={(e) => setUpdateMeaning(e.target.value)} />
              </InputGroup>
            </Stack>
            <ButtonGroup mt={3} right={12} position={"absolute"}>
              <Btn text="저장" onClick={handleUpdate} />
              <Btn text="삭제" colorScheme="red" onClick={handleDelete} />
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
          id={word.id.toString()}
        >
          <Stack direction="row" mt={-4}>
            <Link to={`grammar/${word.word}}`}>
              <Icon as={FaRobot} boxSize={8} />
            </Link>
            <Text fontSize="xl" fontFamily={"monospace"} right={24}>
              {word.word}
            </Text>
            <Stack direction="row" position="absolute" right={6}>
              <Text fontSize="xl" color={"gray.400"}>
                {word.meaning}
              </Text>
              <Btn
                size="xs"
                variant="ghost"
                text={<Icon as={FaPencilAlt} boxSize={3} />}
                onClick={() => setIsEditing((prev) => !prev)}
              />
            </Stack>
          </Stack>
        </Box>
      )}
    </>
  );
}
