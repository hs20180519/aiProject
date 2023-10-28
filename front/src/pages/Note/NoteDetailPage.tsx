/* eslint-diabled */
import { Stack, Heading } from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import { getNoteDetail } from "../../apis/customWord";
import { useState, useEffect } from "react";
import WordBox from "./Components/WordBox";
import { stringify } from "querystring";
import Pagination from "../../components/Pagination";

// 단어가 출력이 안됨
// 커스텀 단어장 목록이 안불러와짐
/** 단어 상세보기 페이지입니다. */
export default function NoteDetailPage() {
  const { note_id } = useParams();

  const [words, setWords] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  /** 카테고리별 단어장 조회하는 함수입니다. */
  const fetchNoteDetail = async (page = 1) => {
    parseInt(note_id);
    let res;
    try {
      const id = parseInt(note_id);
      if (!isNaN(id)) {
        res = await getNoteDetail(`book=custom&customBookId=${note_id}&page=${page}`);
      } else {
        res = await getNoteDetail(`book=${note_id}&page=${page}`);
      }
      setWords(res.data.words);
      setCurrentPage(res.data.currentPage);
      setTotalPages(res.data.totalPages);
    } catch (e) {
      console.error(e);
    }
  };

  function handleChangePage(page) {
    fetchNoteDetail(page);
  }

  useEffect(() => {
    fetchNoteDetail();
  }, []);
  return (
    <Stack>
      <Heading>{note_id}</Heading>
      <WordBox words={words} isEditing={isEditing} />
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        handleChangePage={handleChangePage}
      />
    </Stack>
  );
}
