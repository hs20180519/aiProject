import React, { useEffect, useState } from "react";
import * as instance from "../../apis/api";
import { Box, Grid } from "@chakra-ui/react";
import StorageWordBox from "./Components/StorageWordBox";
import CustomModal from "../../components/CustomModal";
import Pagination from "../../components/Pagination";
import SearchBar from "./Components/SearchBar";

interface Word {
  id: number;
  word: string;
  meaning: string;
  category: string;
  isFavorite: boolean;
}

const Storage: React.FC = () => {
  const [wordData, setWordData] = useState<Word[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [pagingIndex, setPagingIndex] = useState(1);
  const limit = 5; //페이지당 아이템 수

  // 단어 데이터 가져오는 함수
  const fetchWordData = async (pageNumber: number) => {
    try {
      const response = await instance.get(`/storage?page=${pageNumber}&limit=8`);
      if (response.data && Array.isArray(response.data.words)) {
        setWordData(response.data.words);
        setTotalPages(response.data.totalPages);
        setCurrentPage(pageNumber);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // 페이지 변경 핸들러 함수
  const handlePageChange = async (pageNumber: number) => {
    try {
      if (isSearching) {
        const response = await instance.get(
          `/storage/search?q=${searchTerm}&page=${pageNumber}&limit=8`,
        );
        if (response.data && Array.isArray(response.data.words)) {
          setWordData(response.data.words);
          setCurrentPage(pageNumber);
        }
      } else {
        fetchWordData(pageNumber);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // 페이지 인덱스 변경 핸들러 함수
  const handleChangePagingIndex = (pagingIndex: number) => {
    setPagingIndex(pagingIndex);
  };

  // 즐겨찾기 클릭 핸들러 함수
  const handleBookmarkClick = async (wordId: number, isFavorite: boolean) => {
    try {
      if (!isFavorite) {
        // 즐겨찾기 추가
        const data = { wordId };
        const response = await instance.post(`/book/favorite?wordId=${wordId}`, data);
        if (response.status === 201) {
          setWordData((prevWordData) =>
            prevWordData.map((word) => (word.id === wordId ? { ...word, isFavorite: true } : word)),
          );
          // 즐겨찾기가 추가되면 모달
          setIsModalOpen(true);
          const msg = `즐겨찾기가 추가되었습니다. 단어장에서 확인해주세요 :)`;
          setModalMessage(msg);
        }
      } else {
        // 즐겨찾기 제거
        const response = await instance.delete(`/book/favorite?wordId=${wordId}`);
        if (response.status === 200) {
          setWordData((prevWordData) =>
            prevWordData.map((word) =>
              word.id === wordId ? { ...word, isFavorite: false } : word,
            ),
          );
        }
      }
    } catch (error) {
      console.error("Error toggling favorite status:", error);
    }
  };
  const handleSearchClick = async (q: string) => {
    if (q.trim() === "") {
      fetchWordData(1);
      // 검색어가 없을 때 기존 데이터를 보여줌
      setIsSearching(false);
      setSearchTerm("");
    } else {
      try {
        // 검색어가 있는 경우 검색 결과 페이지를 가져오도록 요청
        const response = await instance.get(`/storage/search?q=${q}&limit=8`);
        if (response.data && Array.isArray(response.data.words)) {
          setWordData(response.data.words);
          setIsSearching(true);
          setTotalPages(response.data.totalPages);
          setPagingIndex(1);
          setSearchTerm(q);
        }
      } catch (error) {
        console.error("Error searching for words:", error);
      }
    }
  };

  // 페이지 로드시 초기 데이터 가져오기
  useEffect(() => {
    fetchWordData(1);
  }, []);

  useEffect(() => {}, [currentPage]);

  return (
    <Box>
      <SearchBar onSearch={handleSearchClick} />
      <Grid templateColumns="repeat(2, 1fr)" gap={1}>
        {wordData.map((word) => (
          <StorageWordBox key={word.id} word={word} onBookmarkClick={handleBookmarkClick} />
        ))}
      </Grid>
      <CustomModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        message={modalMessage}
      />
      <Pagination
        pagingIndex={pagingIndex}
        currentPage={currentPage}
        limit={limit}
        totalPage={totalPages}
        handleChangePage={handlePageChange}
        handleChangePaginIndex={handleChangePagingIndex}
      />
    </Box>
  );
};
export default Storage;
