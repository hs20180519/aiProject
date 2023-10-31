import { useState, useEffect } from "react";
import NoteListBox from "./Components/NoteListBox";
import {
  useColorModeValue,
  Flex,
  Spacer,
  Box,
  Heading,
  Badge,
  SimpleGrid,
  Stack,
  AbsoluteCenter,
  ButtonGroup,
  useToast,
} from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import {
  getCustomNotes,
  postCustomNote,
  delCustomNote,
  delAllCustomNote,
} from "../../apis/customWord";
import Btn from "../../components/Btn";

import Loading from "../../components/Loading";

const NOTE_LIST = [
  { id: "correct", title: "학습한 단어" },
  { id: "incorrect", title: "틀린 단어" },
  { id: "favorite", title: "⭐️즐겨찾기" },
];
const TOAST_TIMEOUT_INTERVAL = 800;

/** 유저가 저장한 단어장 목록을 보여주는 페이지입니다. */
export default function CustomNoteListPage() {
  const navigate = useNavigate();
  const toast = useToast();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const [noteList, setNoteList] = useState(NOTE_LIST);
  const [customNoteList, setCustomNoteList] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [checkedItems, setCheckedItems] = useState([false, false]);
  const allChecked = checkedItems.every(Boolean);

  /** 노트 목록 가져오기 */
  const fetchNoteList = async () => {
    setLoading(true);
    try {
      const res = await getCustomNotes();
      if (res.status === 200) {
        setCustomNoteList(res.data);
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  /** 타이틀 저장시 유저 커스텀 단어장 생성 */
  const fetchNewCustomNote = async () => {
    const data = { title: "빈 단어장" };
    try {
      const res = await postCustomNote(data);
      if (res.status === 201) {
        if (res.status === 201) {
          toast({
            title: `단어장 생성완료!`,
            status: "success",
            isClosable: true,
            duration: TOAST_TIMEOUT_INTERVAL,
          });
          navigate(`/main/note_add/${res.data.id}`);
        }
      } else if (res.status === 400) {
        toast({
          title: `잘못된 요청입니다.`,
          status: "error",
          isClosable: true,
          duration: TOAST_TIMEOUT_INTERVAL,
        });
      }
    } catch (e) {
      console.error(e);
    }
  };

  /** 단어장 선택 삭제하기 */
  const fetchDelCustomNote = async (note_id) => {
    try {
      const res = await delCustomNote(`customBookId=${note_id}`);
      console.dir(res);
      if (res.status === 200) {
        toast({
          title: `삭제되었습니다.`,
          status: "success",
          isClosable: true,
          duration: TOAST_TIMEOUT_INTERVAL,
        });
        fetchNoteList();
      }
    } catch (e) {
      console.error(e);
    }
  };

  /** 단어장 전체 삭제 */
  const fetchDelAllCustomNote = async () => {
    try {
      const res = await delAllCustomNote();
      if (res.status === 200) {
        toast({
          title: `전체 삭제 완료`,
          status: "success",
          isClosable: true,
          duration: TOAST_TIMEOUT_INTERVAL,
        });
        fetchNoteList();
        setIsEditing(false);
      }
    } catch (e) {
      console.error(e);
      toast({
        title: `단어장 삭제중 에러가 발생하였습니다.`,
        status: "error",
        isClosable: true,
        duration: TOAST_TIMEOUT_INTERVAL,
      });
    } finally {
      setIsEditing(false);
    }
  };

  /** 선택삭제 */
  const deleteCustomNote = async (note_id: string) => {
    // 모달로 삭제여부 확인
    fetchDelCustomNote(note_id);
  };

  /** 전체삭제 함수 */
  const delAllNote = () => {
    // 모달로 삭제여부 확인
    fetchDelAllCustomNote();
  };

  useEffect(() => {
    fetchNoteList();
  }, []);

  if (loading) return <Loading />;

  return (
    <>
      <Flex minWidth="max-content" alignItems="center" gap="2" mb="5">
        <Box p="2">
          <Heading size="md">내 단어장</Heading>
        </Box>
        <Spacer />
        {isEditing ? (
          <ButtonGroup>
            <Btn text="전체 삭제" colorScheme="red" onClick={fetchDelAllCustomNote} />
            <Btn text="단어장 저장" onClick={() => setIsEditing((prev) => !prev)} />
          </ButtonGroup>
        ) : (
          <Btn
            text={isEditing ? "편집 완료" : "단어장 편집"}
            onClick={() => setIsEditing((prev) => !prev)}
          />
        )}
      </Flex>

      <Stack spacing={5}>
        <Box
          rounded={"lg"}
          bg={useColorModeValue("gray100", "gray.700")}
          boxShadow={"lg"}
          p={8}
          position="relative"
          h="120px"
          borderWidth="3px"
          borderRadius="lg"
          onClick={fetchNewCustomNote}
          cursor={"pointer"}
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

        <NoteListBox noteList={noteList} isEditing={false} onDelete={null} />
        <NoteListBox noteList={customNoteList} isEditing={isEditing} onDelete={deleteCustomNote} />
      </Stack>
    </>
  );
}
