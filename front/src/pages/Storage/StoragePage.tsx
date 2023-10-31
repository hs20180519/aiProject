import React, { useEffect, useState } from "react";
import * as instance from "../../apis/api";
import { Box, Grid } from "@chakra-ui/react";
import WordBox from "./Components/WordBox";
import CustomModal from "../../components/CustomModal";
import Pagination from "../../components/Pagination";

// 단어 검색 가능하게

interface Word {
  id: number;
  word: string;
  meaning: string;
  category: string;
  isFavorite: boolean;
}

const Storage: React.FC = () => {
  const [wordData, setWordData] = useState<Word[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [pagingIndex, setPagingIndex] = useState(1);
  const limit = 5;

  const fetchWordData = async (pageNumber: number) => {
    try {
      const response = await instance.get(`/storage?page=${pageNumber}&limit=10`);
      if (response.data && Array.isArray(response.data.words)) {
        setWordData(response.data.words);
        setTotalPages(response.data.totalPages);
        console.log(response.data.totalPages);
        setCurrentPage(pageNumber);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handlePageChange = (pageNumber: number) => {
    fetchWordData(pageNumber);
  };

  const handleChangePagingIndex = (pagingIndex: number) => {
    const range = pagingIndex === 1 ? 0 : (pagingIndex - 1) * limit;
    console.log(range);
    setPagingIndex(pagingIndex);
  };

  const handleBookmarkClick = async (wordId: number, isFavorite: boolean) => {
    try {
      if (!isFavorite) {
        const data = { wordId };
        const response = await instance.post(`/book/favorite?wordId=${wordId}`, data);
        if (response.status === 201) {
          setWordData((prevWordData) =>
            prevWordData.map((word) => (word.id === wordId ? { ...word, isFavorite: true } : word)),
          );
          // 즐겨찾기가 추가되면 모달을 엽니다.
          setIsModalOpen(true);
          const msg = `즐겨찾기가 추가되었습니다. 단어장에서 확인해주세요 :)`;
          setModalMessage(msg);
        }
      } else {
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

  useEffect(() => {
    fetchWordData(1);
  }, []);

  useEffect(() => {
    console.log(currentPage);
  }, [currentPage]);

  return (
    <Box>
      <Grid templateColumns="repeat(2, 1fr)" gap={1}>
        {wordData.map((word) => (
          <WordBox key={word.id} word={word} onBookmarkClick={handleBookmarkClick} />
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
