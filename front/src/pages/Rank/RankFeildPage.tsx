import { useEffect, useState } from "react";
import styled from "@emotion/styled";
import RankList from "./RankItem";
import UserRankBox from "./UserRankBox";
import * as Api from "../../apis/api";
import Loading from "../../components/Loading";
import Pagination from "../../components/Pagination";
import { Box, Heading } from "@chakra-ui/react";

export default function RankFeildPage() {
  const [loading, setLoading] = useState(false);
  const [usersRank, setUsersRank] = useState([]);

  // Pagination
  const limit = 3;
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pagingIndex, setPagingIndex] = useState(1);

  const fetchUserRanks = async (page = 1) => {
    setLoading(true);
    const res = await Api.get(`/rank`);
    const data = res?.data;

    if (Array.isArray(data)) {
      setUsersRank(data);
    } else {
      setUsersRank([]);
    }
    setLoading(false);
  };

  /** 페이지네이션 핸들링 */
  const handleChangePage = (page: number) => {
    fetchUserRanks(page);
  };
  const handleChangePaingIndex = (pagingIndex: number) => {
    const range = pagingIndex === 1 ? 0 : (pagingIndex - 1) * limit;
    setPagingIndex(pagingIndex);
  };

  useEffect(() => {
    if (usersRank) {
      fetchUserRanks();
    } else {
      console.log("랭킹 유저가 없습니다.");
    }
  }, []);

  if (loading) return <Loading />;

  return (
    <>
      <Box>
        <Heading>Wordy 랭킹</Heading>
      </Box>
      <UserRankBox />
      <RankList rankList={usersRank} />

      <Pagination
        pagingIndex={pagingIndex}
        currentPage={currentPage}
        limit={limit}
        handleChangePage={handleChangePage}
        handleChangePaginIndex={handleChangePaingIndex}
        totalPage={totalPages}
      />
    </>
  );
}
