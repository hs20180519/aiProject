import {
  Box,
  Text,
  useColorModeValue,
  Stack,
  Input,
  Button,
  ButtonGroup,
  Icon,
  InputGroup,
  InputLeftElement,
  Flex,
  Spacer,
} from "@chakra-ui/react";
import { FaRobot, FaSortAlphaUp, FaDog, FaPencilAlt } from "react-icons/fa";
import ConfirmModal from "../../../components/ConfirmModal";
import { Link } from "react-router-dom";
import { useState } from "react";
import * as type from "../../../apis/types/custom";
import Btn from "../../../components/Btn";
import BookMark from "../../../components/BookMark";

interface WordBoxProps {
  word: type.WordsProps;
  isBookmarked: boolean;
  handleBookmark: (word_id: number) => void | Promise<void>;
  onUpdate: (word_id: number, data: type.SubmitCustomWord) => void | Promise<void>;
  onDelete: (word_id: number) => void | Promise<void>;
  isCustom: boolean;
}

/** 단어와 뜻을 표시하는 상자입니다. */
export default function WordBox({
  word,
  isBookmarked,
  handleBookmark,
  onUpdate,
  onDelete,
  isCustom,
}: WordBoxProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [updateWord, setUpdateWord] = useState(word.word);
  const [updateMeaning, setUpdateMeaning] = useState(word.meaning);

  /** 단어장 삭제 확인 모달 */
  const [isModalOpen, setIsModalOpen] = useState(false);

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
      <ConfirmModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen((prev) => !prev)}
        message1={"확인"}
        message2={"삭제하시겠습니까?"}
        onClick={handleDelete}
      />
      {!isEditing ? (
        <Box
          fontWeight="semibold"
          rounded={"lg"}
          bg={useColorModeValue("white", "gray.700")}
          boxShadow={"lg"}
          alignItems="center"
          pl={3}
          pr={3}
          height="80px"
          borderWidth="3px"
          borderRadius="lg"
          id={word.id.toString()}
          position={"relative"}
        >
          <Flex alignItems={"center"} h={"100%"}>
            <Link to={`/main/grammar/${word.word}`}>
              <Flex alignItems={"center"} height={"100%"}>
                <Icon as={FaRobot} boxSize={8} marginRight={"6px"} />
                <Text fontSize="xl" fontFamily={"monospace"} right={24}>
                  {word.word}
                </Text>
              </Flex>
            </Link>
            <Spacer />
            <Box>
              <Text fontSize="xl" color={"gray.400"}>
                {word.meaning}
              </Text>
            </Box>
            <Box position={"absolute"} right={"-4px"} top={"-4px"}>
              <Flex alignItems={"center"} justifyContent={"center"}>
                {isCustom ? (
                  <Button padding={0} variant="ghost" onClick={() => setIsEditing((prev) => !prev)}>
                    <Icon as={FaPencilAlt} boxSize={3} />
                  </Button>
                ) : (
                  <BookMark favorite={isBookmarked} onClick={handleBookmark} />
                )}
              </Flex>
            </Box>
          </Flex>
        </Box>
      ) : (
        <Box
          fontWeight="semibold"
          rounded={"lg"}
          bg={useColorModeValue("white", "gray.700")}
          boxShadow={"lg"}
          alignItems="center"
          pt={8}
          pl={2}
          pr={2}
          height="110px"
          borderWidth="3px"
          borderRadius="lg"
          id={word.id.toString()}
          position={"relative"}
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
          <ButtonGroup mt={1} right={13} position={"absolute"}>
            <Btn text="저장" onClick={handleUpdate} />
            <Btn text="삭제" colorScheme="red" onClick={() => setIsModalOpen((prev) => !prev)} />
          </ButtonGroup>
        </Box>
      )}
    </>
  );
}
