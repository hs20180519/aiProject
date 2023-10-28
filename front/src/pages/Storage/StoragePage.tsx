import React, { useEffect, useState } from "react";
import * as instance from "../../apis/api";
import { Box, Button, Flex } from "@chakra-ui/react";

// 정렬 추가 ? .. abc 순 / 역순으로
// 단어 검색 가능하게

interface Word {
  id: number;
  word: string;
  meaning: string;
  category: string;
}

const Storage: React.FC = () => {
  const [wordData, setWordData] = useState<Word[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchWordData = async (pageNumber: number) => {
    try {
      const response = await instance.get(`/storage?page=${pageNumber}`);
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

  const renderWords = () => {
    const wordGroups = [];
    for (let i = 0; i < wordData.length; i += 2) {
      const word1 = wordData[i];
      const word2 = wordData[i + 1];

      wordGroups.push(
        <Flex key={i} width="100%">
          <Box
            key={word1.id}
            style={{
              textAlign: "center",
              backgroundColor: "white",
              width: "50%",
              height: "100px",
              border: "1px solid #ddd",
              borderRadius: "5px",
              padding: "10px",
              margin: "10px",
            }}
          >
            <p style={{ fontSize: "30px" }}>{word1.word}</p>
            <p style={{ color: "gray" }}>{word1.meaning}</p>
          </Box>

          {word2 && (
            <Box
              key={word2.id}
              style={{
                textAlign: "center",
                backgroundColor: "white",
                width: "50%",
                height: "100px",
                border: "1px solid #ddd",
                borderRadius: "5px",
                padding: "10px",
                margin: "10px",
              }}
            >
              <p style={{ fontSize: "30px" }}>{word2.word}</p>
              <p style={{ color: "gray" }}>{word2.meaning}</p>
            </Box>
          )}
        </Flex>,
      );
    }
    return wordGroups;
  };

  const renderPagination = () => {
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
      {renderWords()}
      {renderPagination()}
    </Box>
  );
};

export default Storage;
