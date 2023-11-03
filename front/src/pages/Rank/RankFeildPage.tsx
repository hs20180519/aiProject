import { useEffect, useState } from "react";
import styled from "@emotion/styled";
import RankList from "./RankItem";
import * as Api from "../../apis/api";
import Loading from "../../components/Loading";
import Pagination from "../../components/Pagination";
import { Box, Heading, Stack, Text } from "@chakra-ui/react";

export default function RankFeildPage() {
  const [loading, setLoading] = useState(false);
  const [usersRank, setUsersRank] = useState([]);
  const [userRankInfo, setUserRankInfo] = useState({
    name: "",
    nickname: "",
    score: 0,
    rank: 0,
  });

  // Pagination
  const limit = 5;
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pagingIndex, setPagingIndex] = useState(1);

  /** 전체 유저 랭킹 조회 */
  const fetchUsersRanks = async (page = 1) => {
    setLoading(true);
    const res = await Api.get(`/rank?page=${page}&limt=100`);
    const data = res.data.users;
    console.log(res);
    if (Array.isArray(data)) {
      setUsersRank(data);
      setCurrentPage(page);
      setTotalPages(res.data.totalPage);
    } else {
      setUsersRank([]);
    }
    setLoading(false);
  };

  /** 로그인한 유저 랭킹 조회 */
  const fetchUserRank = async () => {
    const res = await Api.get(`/user`);
    const res2 = await Api.get(`/rank/userRank`);
    setUserRankInfo({
      name: res.data.name,
      nickname: res.data.nickname,
      score: res2.data.score,
      rank: res2.data.rank,
    });
  };
  /** 페이지네이션 핸들링 */
  const handleChangePage = async (page: number) => {
    try {
      const queryString = `/rank?page=${page}&limit=100`;
      const res = await Api.get(queryString);
      if (res.status === 200) {
        fetchUsersRanks(page);
      } else {
        console.log("잘못된 요청입니다.");
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
    if (usersRank) {
      fetchUsersRanks();
      fetchUserRank();
    } else {
      console.log("랭킹 유저가 없습니다.");
    }
  }, []);

  if (loading) return <Loading />;

  return (
    <>
      <Stack>
        <Heading color={"teal.600"}>Wordy 랭킹🏅</Heading>
        <Text
          color={"gray.600"}
        >{`${userRankInfo.name}님의 현재 등수는 ${userRankInfo.rank}등입니다`}</Text>
      </Stack>
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
