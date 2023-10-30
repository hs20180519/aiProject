import React, { useEffect, useState } from "react";
import * as instance from "../../apis/api";
import { Box, Button, Flex, Grid } from "@chakra-ui/react";
import WordBox from "./Components/WordBox";
import CustomModal from "./Components/CustomModal";
import Pagination from "../../components/Pagination";

// 정렬 추가 ? .. abc 순 / 역순으로
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

  const fetchWordData = async (pageNumber: number) => {
    try {
      const response = await instance.get(`/storage?page=${pageNumber}&limit=15`);
      if (response.data && Array.isArray(response.data.words)) {
        setWordData(response.data.words);
        setTotalPages(response.data.totalPages);
        setCurrentPage(pageNumber);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchWordData(1); // 페이지 번호 1로 데이터 가져오기
  }, []);

  const handlePageChange = (pageNumber: number) => {
    fetchWordData(pageNumber);
  };

  const handlePageChangeIndex = (pageIndex: number) => {
    fetchWordData((pageIndex - 1) * 15 + 1);
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
          setModalMessage("즐겨찾기가 추가되었습니다. 단어장에서 확인해주세요 :)");
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

  const renderPagination = () => {
    return (
      <Pagination
        pagingIndex={currentPage}
        limit={5}
        totalPage={totalPages}
        currentPage={currentPage}
        handleChangePage={handlePageChange}
        handleChangePaginIndex={handlePageChangeIndex}
      />
    );
  };
  const renderPagination2 = () => {
    return (
      <Flex justifyContent="center" alignItems="center" marginTop="20px">
        <Button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          marginRight="10px"
        >
          이전
        </Button>
        <p style={{ margin: "0 10px" }}> {currentPage}</p>
        <Button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          marginLeft="10px"
        >
          다음
        </Button>
      </Flex>
    );
  };

  return (
    <Box>
      <Grid templateColumns="repeat(3, 1fr)" gap={1}>
        {wordData.map((word) => (
          <WordBox key={word.id} word={word} onBookmarkClick={handleBookmarkClick} />
        ))}
      </Grid>
      <CustomModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        message={modalMessage}
      />
      {renderPagination()}
    </Box>
  );
};

export default Storage;
