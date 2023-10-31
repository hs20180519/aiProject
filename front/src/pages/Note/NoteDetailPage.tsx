/* eslint-diabled */
import {
  Stack,
  Heading,
  HStack,
  Box,
  FormControl,
  useToast,
  useColorModeValue,
} from "@chakra-ui/react";
import Btn from "../../components/Btn";
import { useParams } from "react-router-dom";

import { useState, useEffect } from "react";

import WordBox from "./Components/WordBox";
import { stringify } from "querystring";
import Pagination from "../../components/Pagination";
import SelectNote from "../../components/SelectNote";
import SearchBar from "../Storage/Components/SearchBar";

import * as Api from "../../apis/api";
import * as type from "../../apis/types/custom";
import {
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

  /**SelectNote */
  const [category, setCategory] = useState([]);
  const [customNote, setCustomNote] = useState([]);
  const [title, setTitle] = useState("");
  const [words, setWords] = useState([]);

  /** Search Word */
  const [keyword, setKeyword] = useState(true);

  const [titleIsEditing, setTitleIsEditing] = useState(true);
  const [isItAdd, setIsItAdd] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [customWord, setCustomWord] = useState<type.SubmitCustomWord>({
    word: "",
    meaning: "",
  });

  /**  Pagination */
  const limit = 5;
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pagingIndex, setPagingIndex] = useState(1);

  /** bookmard */
  const [isBookmarked, setIsBookmarked] = useState(false);

  /** 카테고리별 단어장 조회하는 함수입니다. */
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
        setTitleIsEditing(false);
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
      }
    } catch (e) {
      console.error(e);
    }
  };

  // todo 카테고리가 바뀌었을 때 다른 데이터를 가져오려면 어떻게하지?
  // 컴포넌트로 나눠야하나?
  /** 단어장 이동하는 함수 */
  const onSelect = (e) => {
    console.log(e.target.value);
  };

  /** 즐겨찾기 추가
   * currentPage만 가능
   */
  const fetchBookmark = async () => {
    const data = "wordId";
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

  // delete api 새로 만들기
  /** 즐겨찾기 삭제 */
  const fetchDelBookmark = async () => {
    const data = "wordId";
    try {
      const res = await Api.delete("/favorite");
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

  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchClick = async (q: string) => {
    if (q.trim() === "") {
      fetchNoteDetail();
      // 검색어가 없을 때 기존 데이터를 보여줌
      setKeyword(false);
      setSearchTerm("");
    } else {
      try {
        console.log("단어 검색 api완성 후 연결예정");
        // // 검색어가 있는 경우 검색 결과 페이지를 가져오도록 요청
        // const response = await instance.get(`/storage/search?q=${q}&limit=8`);
        // if (response.data && Array.isArray(response.data.words)) {
        //   setWords(response.data.words);
        //   setKeyword(true);
        //   setTotalPages(response.data.totalPages);
        //   setPagingIndex(1);
        //   setSearchTerm(q);
        // }
      } catch (error) {
        console.error("Error searching for words:", error);
      }
    }
  };

  /** 페이지네이션 핸들링 */
  const handleChangePage = (page: number) => {
    fetchNoteDetail(page);
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
      <HStack spacing={2}>
        <SelectNote onSelect={onSelect} category={category} customNote={customNote} />
        <SearchBar onSearch={handleSearchClick} />
      </HStack>
      <Heading color={"teal"}>{title}</Heading>

      {words.map((word: type.WordsProps) => (
        <WordBox
          word={word}
          isBookmarked={isBookmarked}
          onUpdate={fetchEditWord}
          onDelete={fetchDeleteWord}
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
