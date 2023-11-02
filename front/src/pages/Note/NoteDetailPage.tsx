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
} from "@chakra-ui/react";
import Btn from "../../components/Btn";
import { FaPencilAlt, FaSortAlphaUp, FaDog } from "react-icons/fa";
import { useParams } from "react-router-dom";

import { useState, useEffect } from "react";

import WordBox from "./Components/WordBox";
import Pagination from "../../components/Pagination";
import SelectNote from "../../components/SelectNote";
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

  /** 단어장 변경 Selector */
  const [category, setCategory] = useState(NOTE_LIST);
  const [customNote, setCustomNote] = useState([]);

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

  /**  페이지네이션 */
  const limit = 5;
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pagingIndex, setPagingIndex] = useState(1);

  const [isCustom, setIsCustom] = useState(!isNaN(parseInt(note_id)));

  /** bookmark */
  const [isBookmarked, setIsBookmarked] = useState(false);

  /** 커스텀 단어장 목록 가져오기 */
  const fetchCustomNotes = async () => {
    try {
      const res = await getCustomNotes();
      console.log(res);
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
      console.log(res);

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
      console.log("-----단어장 이름 변경----");
      console.log(res);
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

  /** 단어장 이동하는 함수 */
  const onSelect = (e) => {
    console.log(e.target.value);
    fetchCustomNotes();
  };

  /**
   * 즐겨찾기 추가
   * currentPage만 가능
   */
  const fetchBookmark = async (word_id: number) => {
    const data = word_id;
    console.log(word_id); //todo 여기서부터
    try {
      const res = await Api.post("/favorite", data);
      if (res.status === 201) {
        setIsBookmarked(true);
        toast({
          title: `즐겨찾기 추가완료!`,
          status: "success",
          isClosable: true,
          duration: TOAST_TIMEOUT_INTERVAL,
        });
      }
    } catch (e) {
      console.error(e);
    }
  };

  /** 즐겨찾기 삭제 */
  const fetchDelBookmark = async (word_id: number) => {
    const data = word_id;
    try {
      const res = await Api.delete(`book/favorite?wordId=${data}`);
      if (res.status === 200) {
        setIsBookmarked(false);
        toast({
          title: `즐겨찾기 단어 삭제 완료!`,
          status: "success",
          isClosable: true,
          duration: TOAST_TIMEOUT_INTERVAL,
        });
      }
    } catch (e) {
      console.error(e);
    }
  };

  /** 즐겨찾기 핸들러 */
  const handleChangeBookmark = (word_id: number) => {
    try {
      if (!isBookmarked) {
        fetchBookmark(word_id);
      } else if (isBookmarked) {
        fetchDelBookmark(word_id);
      }
    } catch (e) {
      console.error(e);
    }
  };
  /** 페이지네이션 핸들링 */
  const handleChangePage = async (page: number) => {
    console.log();
    try {
      const id = parseInt(note_id);
      const queryString = !isNaN(id)
        ? `/book/search/?book=customs&page=${page}&limit&customBookId=${id}&p=${searchTerm}`
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
          ? `/book/search/?book=customs&customBookId=${id}&p=${q}`
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

  const handleChangePaingIndex = (pagingIndex: number) => {
    const range = pagingIndex === 1 ? 0 : (pagingIndex - 1) * limit;
    setPagingIndex(pagingIndex);
  };

  useEffect(() => {
    fetchNoteDetail();
  }, []);

  return (
    <Stack>
      <SelectNote onSelect={onSelect} category={category} customNote={customNote} />
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
          <Btn
            text={isItAdd ? "추가 완료" : "단어 추가"}
            onClick={() => setIsItAdd((prev) => !prev)}
          />
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
          w="360px"
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
      {words.map((word: type.WordsProps) => (
        <WordBox
          word={word}
          handleBookmark={handleChangeBookmark}
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
    </Stack>
  );
}
