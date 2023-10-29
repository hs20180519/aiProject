/* eslint-diabled */
import { Stack, Heading, HStack, useToast } from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import { getNoteDetail } from "../../apis/customWord";
import { useState, useEffect } from "react";
import * as Api from "../../apis/api";
import WordBox from "./Components/WordBox";
import { stringify } from "querystring";
import Pagination from "../../components/Pagination";
import SelectNote from "../../components/SelectNote";
import Input from "../../components/InputFeild";

const NOTE_LIST = [
  { id: "correct", title: "학습한 단어" },
  { id: "incorrect", title: "틀린 단어" },
];

const TOAST_TIMEOUT_INTERVAL = 700;

/** 단어 상세보기 페이지입니다. */
export default function NoteDetailPage() {
  const { note_id } = useParams();
  const toast = useToast();

  /**SelectNote */
  const [category, setCategory] = useState([]);
  const [customNote, setCustomNote] = useState([]);
  const [words, setWords] = useState([]);

  /** Search Word */
  const [keyword, setKeyword] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  /**  Pagination */
  const limit = 5;
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pagingIndex, setPagingIndex] = useState(1);

  /** bookmard */
  const [isBookmarked, setIsBookmarked] = useState(false);

  /** 카테고리별 단어장 조회하는 함수입니다. */
  const fetchNoteDetail = async (page = 1) => {
    parseInt(note_id);
    // todo 페이지 관련 분리하기 if문으로 지금 페이지에 res !== undefined ??
    // note_id 숫자  => 내가 생성한 단어
    // note_id 문자열 => 토익, 토플, 학습단어
    try {
      const id = parseInt(note_id);
      const url = !isNaN(id)
        ? `customBookId=${note_id}&page=${page}`
        : `book=${note_id}&page=${page}`;
      const res = await getNoteDetail(url);
      console.log(res);
      setWords(res.data.words);
      setCurrentPage(res.data.currentPage);
      setTotalPages(101); // 수정된 api 합친 후 변경  setTotalPages(res.data.totalPages);
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

  /** 즐겨찾기 추가 */
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
    console.log("------현재페이지--------");
    console.log(currentPage);
  }, [currentPage]);

  useEffect(() => {
    if (keyword !== "") console.log(keyword);
  }, [keyword]);

  // todo 해당단어장 타이틀명으로 해딩태그 넣기
  return (
    <Stack>
      <HStack spacing={2}>
        <SelectNote onSelect={onSelect} category={category} customNote={customNote} />
        <Input placeholder="단어 검색" />
      </HStack>
      <Heading color={"teal"}>{note_id}</Heading>
      <WordBox words={words} isEditing={isEditing} isBookmarked={isBookmarked} />
      <Pagination
        pagingIndex={pagingIndex}
        currentPage={currentPage}
        limit={limit}
        handleChangePage={handleChangePage}
        handleChangePaginIndex={handleChangePaingIndex}
        totalPage={101}
      />
    </Stack>
  );
}
