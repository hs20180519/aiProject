import { useState, useEffect } from "react";
import CustomWordList from "./CustomNoteList.component";
import {
  useColorModeValue,
  Flex,
  Spacer,
  Box,
  Heading,
  ButtonGroup,
  Button,
  Badge,
  SimpleGrid,
  AbsoluteCenter,
  useToast,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import * as Api from "../../apis/api";
import CustomWord from "../../apis/customWord";

const TOAST_TIMEOUT_INTERVAL = 700;

export default function CustomNoteListPage() {
  const [customWordList, setCustomWordList] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [checkedItems, setCheckedItems] = useState([false, false]);
  const allChecked = checkedItems.every(Boolean);

  const toast = useToast();

  const fetchCustomNoteList = async () => {
    try {
      // fetch
      const res = await CustomWord.getCustomBookList();
      console.log(res);
      if (res.status === 200) {
        setCustomWordList(res.data);
      }
    } catch (e) {
      // error
      console.error(e);
    }
  };

  const fetchDeleteNote = async (params) => {
    try {
      const res = await CustomWord.deleteCustomBook(params);
      if (res.status === 200) {
        toast({
          title: `삭제 완료!`,
          status: "success",
          isClosable: true,
          duration: TOAST_TIMEOUT_INTERVAL,
        });
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchCustomNoteList();
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
        {/* 학습한 단어 목록 */}
        <Box
          fontWeight="semibold"
          rounded={"lg"}
          bg={useColorModeValue("white", "gray.700")}
          boxShadow={"lg"}
          alignItems="center"
          p={8}
          height="120px"
          borderWidth="3px"
          borderRadius="lg"
        ></Box>
        <CustomWordList customWordList={customWordList} isEditing={isEditing} />
      </SimpleGrid>
    </>
  );
}
