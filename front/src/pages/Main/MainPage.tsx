import { Center, Box, Flex, useColorModeValue, useDisclosure } from "@chakra-ui/react";
import { FiEdit2, FiTrendingUp, FiCodesandbox, FiStar, FiDatabase, FiUser } from "react-icons/fi";
import { useState, useContext, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";

import * as type from "../../apis/types/main";

// global component
import SidebarContent from "./SidebarContent";
import Header from "./Header";
import MobileNav from "./MobileNav";

// context
import { UserStateContext, DispatchContext } from "../../App";

// note
import AddCustomNotePage from "../Note/AddCustomNotePage";
import NoteListPage from "../Note/NoteListPage";
import NoteDetailPage from "../Note/NoteDetailPage";

// rank
import RankFeildPage from "../Rank/RankFeildPage";

// grammar
import GrammarPage from "../Grammar/GramnarPage";

// inner = study
import WordPage from "../Word/WordPage";

// gptPage
import GptDialogPage from "../GptDialogPage/GptDialogPage";
import Loading from "../../components/Loading";
import ParamGptDialogPage from "../GptDialogPage/ParamGptDialogPage";

// mypage
import MyPage from "../MyPage";

// storage
import StoragePage from "../Storage/StoragePage";

const MainPage = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();
  const { user } = useContext(UserStateContext);
  const dispatch = useContext(DispatchContext);

  // 메인페이지가 마운트 될 시 유저가 없으면 로그인 페이지로 리다이렉트
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user]);

  const handleClickLogout = () => {
    // 1. 세션 스토리지에서 토큰을 삭제한다.
    sessionStorage.removeItem("userToken");

    // 2. 로그아웃 상태를 dispatch 한다.
    dispatch({ type: "LOGOUT" });

    // 3. 랜딩 페이지로 이동한다.
    navigate("/");
  };

  if (!user) return <Loading />;

  return (
    <Box minH={"100vh"} bg={useColorModeValue("gray.100", "gray.900")}>
      <SidebarContent
        onClose={onClose}
        display={{ base: "none", md: "block" }}
        position={"fixed"}
      />
      <Header isOpen={isOpen} onClose={onClose} />
      <MobileNav onOpen={onOpen} nickname={user.nickname} onLogout={handleClickLogout} />
      <Box ml={{ base: 0, md: 60 }} p={"4"}>
        <Routes>
          <Route path="" element={<WordPage />} />
          <Route path="notes" element={<NoteListPage />} />
          <Route path="note/:note_id" element={<NoteDetailPage />} />
          <Route path="note_add/:note_id" element={<AddCustomNotePage />} />
          <Route path="rank" element={<RankFeildPage />} />
          <Route path="grammar/:word" element={<GrammarPage />} />
          <Route path="gpt_dialog" element={<GptDialogPage />} />
          <Route path="param_gpt_dialog" element={<ParamGptDialogPage />} />
          <Route path="mypage" element={<MyPage />} />
          <Route path="storage" element={<StoragePage />} />
        </Routes>
      </Box>
    </Box>
  );
};

export default MainPage;
