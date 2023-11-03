/* eslint-diabled */
import {
  Stack,
  Heading,
  useColorModeValue,
  Box,
  Spacer,
  useToast,
  Icon,
  Flex,
  FormControl,
  InputGroup,
  InputLeftElement,
  Input,
  Button,
  Text,
} from "@chakra-ui/react";
import Btn from "../../components/Btn";
import { FaPencilAlt, FaSortAlphaUp, FaDog } from "react-icons/fa";
import { useParams } from "react-router-dom";

import { useState, useEffect } from "react";

import WordBox from "./Components/WordBox";
import Pagination from "../../components/Pagination";
import SelectBox from "../../components/SelectNote";
import SearchBar from "../Storage/Components/SearchBar";

import * as Api from "../../apis/api";
import * as type from "../../apis/types/custom";
import {
  getCustomNotes,
  putCustomNoteTitle,
  postCustomWordAdd,
  putCustomWord,
  getNoteDetail,
  delCustomWord,
} from "../../apis/customWord";
import CustomModal from "../../components/CustomModal";

const NOTE_LIST = [
  { id: "correct", title: "학습한 단어" },
  { id: "incorrect", title: "틀린 단어" },
  { id: "favorite", title: "즐겨찾기" },
];

const TOAST_TIMEOUT_INTERVAL = 700;

/** 단어 상세보기 페이지입니다. */
export default function NoteDetailPage() {
  const { note_id } = useParams();
  const toast = useToast();

  /** 해당 단어장 목록 조회 */
  const [words, setWords] = useState<type.WordsProps[]>([]);

  /** 단어장 타이틀 변경 */
  const [disable, setDisable] = useState(false);
  const [isTitleEditing, setIsTitleEditing] = useState(false);

  /** 단어 추가 및 변경 */
  const [isItAdd, setIsItAdd] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  /** 단어 검색 */
  const [searchTerm, setSearchTerm] = useState("");
  const [keyword, setKeyword] = useState(false);

  const [title, setTitle] = useState("");
  const [customWord, setCustomWord] = useState<type.SubmitCustomWord>({
    word: "",
    meaning: "",
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  /**  페이지네이션 */
  const limit = 5;
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pagingIndex, setPagingIndex] = useState(1);

  const [isCustom, setIsCustom] = useState(!isNaN(parseInt(note_id)));

  const [noteList, setNoteList] = useState([]);

  /** 커스텀 단어장 목록 가져오기 */
  const fetchCustomNotes = async () => {
    try {
      const res = await getCustomNotes();
    } catch (e) {
      console.error(e);
    }
  };

  /** 카테고리별 단어장 조회 */
  const fetchNoteDetail = async (page = 1) => {
    // note_id 숫자  => 내가 생성한 단어
    // note_id 문자열 => 토익, 토플, 학습단어
    try {
      const id = parseInt(note_id);
      const queryString = !isNaN(id)
        ? `book=customs&page=&limit&customBookId=${id}`
        : `book=${note_id}&page=${page}`;
      const res = await getNoteDetail(queryString);
      if (res.status === 200) {
        setTitle(res.data.title);
        setWords(res.data.words);
        setCurrentPage(res.data.currentPage);
        setTotalPages(res.data.totalPages);
      }
    } catch (e) {
      console.error(e);
    }
  };

  /** 단어장 이름 변경 */
  const fetchUpdateNoteTitle = async () => {
    const data = { title };
    try {
      const res = await putCustomNoteTitle(data, note_id);
      if (res.status === 200) {
        toast({
          title: `변경 완료!`,
          status: "success",
          isClosable: true,
          duration: TOAST_TIMEOUT_INTERVAL,
        });
        setIsTitleEditing(false);
      }
    } catch (e) {
      console.error(e);
    }
  };

  /** 단어장에 단어추가 */
  const fetchWordAdd = async () => {
    try {
      const res = await postCustomWordAdd(`customBookId=${note_id}`, customWord);
      if (res.status === 201) {
        toast({
          title: "단어 추가 완료!",
          status: "success",
          isClosable: true,
          duration: TOAST_TIMEOUT_INTERVAL,
        });
        setCustomWord({ word: "", meaning: "" });
        fetchNoteDetail();
        setIsItAdd(false);
      }
    } catch (e) {
      toast({
        title: "단어 추가도중 에러가 발생했어요!",
        status: "error",
        isClosable: true,
        duration: TOAST_TIMEOUT_INTERVAL,
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCustomWord({ ...customWord, [name]: value });
  };

  /** 단어를 수정
   * @word_id 수정할 단어의 id
   */
  const fetchEditWord = async (word_id: number, data: type.SubmitCustomWord) => {
    try {
      const res = await putCustomWord(`customBookId=${note_id}&wordId=${word_id}`, data);

      if (res.status === 200) {
        fetchNoteDetail();
      }
    } catch (e) {
      console.error(e);
    }
  };

  /** 단어를 삭제
   * @word_id 삭제 단어의 id
   */
  const fetchDeleteWord = async (word_id: number) => {
    const url = `customBookId=${note_id}&wordId=${word_id}`;
    try {
      const res = await delCustomWord(url);
      if (res.status === 200) {
        toast({
          title: `삭제되었습니다.`,
          status: "warning",
          isClosable: true,
          duration: TOAST_TIMEOUT_INTERVAL,
        });
        fetchNoteDetail();
        setIsEditing(false);
      }
    } catch (e) {
      console.error(e);
    }
  };

  /**
   * 즐겨찾기 추가
   * currentPage만 가능
   */
  const fetchAddBookmark = async (word_id: number) => {
    try {
      const res = await Api.post(`/book/favorite?wordId=${word_id}`);
      if (res.status === 201) {
        setIsModalOpen(true);
        setModalMessage("즐겨찾기 추가 완료!");
        fetchNoteDetail();
      }
    } catch (e) {
      console.error(e);
    }
  };

  /** 즐겨찾기 삭제 */
  const fetchDelBookmark = async (word_id: number) => {
    try {
      const res = await Api.delete(`/book/favorite?wordId=${word_id}`);
      if (res.status === 200) {
        setIsModalOpen(true);
        setModalMessage("즐겨찾기 삭제 완료!");
        fetchNoteDetail();
      }
    } catch (e) {
      console.error(e);
    }
  };

  /** 페이지네이션 핸들링 */
  const handleChangePage = async (page: number) => {
    try {
      const id = parseInt(note_id);
      const queryString = !isNaN(id)
        ? `/book/search/?book=customs&page=${page}&limit=&customBookId=${id}&q=${searchTerm}`
        : `/book/search/?book=${note_id}&page=${page}$customBookId=&q=${searchTerm}`;
      if (keyword) {
        const res = await Api.get(queryString);
        if (res.data && Array.isArray(res.data.words)) {
          setWords(res.data.words);
          setCurrentPage(page);
        }
      } else {
        fetchNoteDetail(page);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  /** 단어검색 api */
  const handleSearchClick = async (q: string) => {
    if (q.trim() === "") {
      fetchNoteDetail();
      setKeyword(false);
      setSearchTerm("");
    } else {
      try {
        const id = parseInt(note_id);
        const queryString = !isNaN(id)
          ? `/book/search/?book=customs&customBookId=${id}&q=${q}`
          : `/book/search/?book=${note_id}&customBookId=&q=${q}`;
        const res = await Api.get(queryString);
        if (res.data && Array.isArray(res.data.words)) {
          setWords(res.data.words);
          setKeyword(true);
          setTotalPages(res.data.totalPages);
          setPagingIndex(1);
          setSearchTerm(q);
        }
      } catch (error) {
        console.error("Error searching for words:", error);
      }
    }
  };

  /** 노트 목록 가져오기 */
  const fetchNoteList = async () => {
    try {
      const res = await getCustomNotes();
      if (res.status === 200) {
        setNoteList(res.data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleChangePaingIndex = (pagingIndex: number) => {
    const range = pagingIndex === 1 ? 0 : (pagingIndex - 1) * limit;
    setPagingIndex(pagingIndex);
  };

  useEffect(() => {
    fetchNoteList();
  }, []);

  useEffect(() => {
    fetchNoteDetail();
    setIsCustom(!isNaN(parseInt(note_id)));
  }, [note_id]);

  return (
    <Stack>
      <SelectBox list={noteList} />
      <SearchBar onSearch={handleSearchClick} />
      <Flex minWidth="max-content" alignItems="center" gap="2" mb="5">
        <Stack direction={"row"}>
          {isTitleEditing ? (
            <Input
              id="title"
              type="text"
              placeholder={title}
              value={title}
              isDisabled={disable}
              onChange={(e) => {
                setTitle(e.target.value);
              }}
            />
          ) : (
            <Heading color={"teal"}>{title}</Heading>
          )}
          {isCustom ? (
            <>
              {isTitleEditing ? (
                <Btn
                  size="m"
                  variant="ghost"
                  text="저장"
                  onClick={() => {
                    fetchUpdateNoteTitle();
                  }}
                />
              ) : (
                <Btn
                  size="m"
                  variant="ghost"
                  text={<Icon as={FaPencilAlt} boxSize={3} />}
                  onClick={() => setIsTitleEditing((prev) => !prev)}
                />
              )}
            </>
          ) : (
            <></>
          )}
        </Stack>
        <Spacer />
        {isCustom ? (
          <Button
            colorScheme="teal"
            onClick={() => setIsItAdd((prev) => !prev)}
            position={"absolute"}
            right={"11px"}
          >
            {isItAdd ? "추가 완료" : "단어 추가"}
          </Button>
        ) : (
          <></>
        )}
      </Flex>
      {isItAdd ? (
        <Box
          rounded={"lg"}
          bg={useColorModeValue("white", "gray.700")}
          boxShadow={"lg"}
          p={8}
          w="343px"
        >
          <Stack spacing={4}>
            <FormControl id="word">
              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <Icon as={FaSortAlphaUp} color="gray.300" boxSize={6} />
                </InputLeftElement>
                <Input
                  type="text"
                  placeholder="추가할 단어"
                  value={customWord.word}
                  name="word"
                  onChange={handleChange}
                />
              </InputGroup>
            </FormControl>
            <FormControl id="mean">
              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <Icon as={FaDog} color="gray.300" boxSize={6} />
                </InputLeftElement>
                <Input
                  type="text"
                  placeholder="단어의 뜻, 의미"
                  value={customWord.meaning}
                  name="meaning"
                  onChange={handleChange}
                />
              </InputGroup>
            </FormControl>
            <Btn text="단어 추가" onClick={fetchWordAdd} variant="solid" type="submit" />
          </Stack>
        </Box>
      ) : (
        <></>
      )}
      <Text color={"tomato"}>로봇🤖 아이콘을 눌러 AI와 함께 영작 연습을 해보세요!</Text>
      {words.map((word: type.WordsProps) => (
        <WordBox
          word={word}
          onAddBookmark={fetchAddBookmark}
          onDelBookmark={fetchDelBookmark}
          onUpdate={fetchEditWord}
          onDelete={fetchDeleteWord}
          isCustom={isCustom}
        />
      ))}
      <Pagination
        pagingIndex={pagingIndex}
        currentPage={currentPage}
        limit={limit}
        handleChangePage={handleChangePage}
        handleChangePaginIndex={handleChangePaingIndex}
        totalPage={totalPages}
      />
      <CustomModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        message={modalMessage}
      />
    </Stack>
  );
}
