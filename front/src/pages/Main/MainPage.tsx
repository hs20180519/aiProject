import { Center, Box, Flex, useColorModeValue, useDisclosure, Spinner } from "@chakra-ui/react";
import { FiEdit2, FiTrendingUp, FiCodesandbox, FiStar, FiUser } from "react-icons/fi";
import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserStateContext, DispatchContext } from "../../App";
import MobileNav from "./MobileNav";
import InnerPage from "../InnerPage";
import * as type from "./main.type";
import SidebarContent from "./SidebarContent";
import Header from "./Header";

const LinkItems: Array<type.LinkItemProps> = [
  { id: "study", name: "단어학습", icon: FiEdit2 },
  { id: "rank", name: "랭킹", icon: FiTrendingUp },
  { id: "wordbook", name: "단어장", icon: FiStar },
  { id: "grammar", name: "문법 교정", icon: FiCodesandbox },
  { id: "mypage", name: "내 정보", icon: FiUser },
];

const MainPage = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();
  const { user } = useContext(UserStateContext);
  const dispatch = useContext(DispatchContext);

  const [component, setComponent] = useState(LinkItems);

  /** 해시로 컴포넌트 변환 */
  const handleComponent = (e) => {
    setComponent(e.this.value);
  };

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

  if (!user)
    return (
      <Flex>
        <Center w="100vw" h="100vh">
          <Spinner size="xl" color="cyan.500" />
        </Center>
      </Flex>
    );

  return (
    <Box minH={"100vh"} bg={useColorModeValue("gray.100", "gray.900")}>
      <SidebarContent onClose={() => onClose} display={{ base: "none", md: "block" }} />
      <Header isOpen={isOpen} onClose={onClose} />
      <MobileNav onOpen={onOpen} nickname={user.nickname} onLogout={handleClickLogout} />
      <Box ml={{ base: 0, md: 60 }} p={"4"}>
        <InnerPage />
      </Box>
    </Box>
  );
};

export default MainPage;
