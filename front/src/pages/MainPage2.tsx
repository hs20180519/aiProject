import {
  IconButton,
  Center,
  Avatar,
  Box,
  CloseButton,
  Flex,
  HStack,
  VStack,
  Icon,
  useColorModeValue,
  Text,
  Drawer,
  DrawerContent,
  useDisclosure,
  BoxProps,
  FlexProps,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Spinner,
} from "@chakra-ui/react";

import {
  FiEdit2,
  FiCodesandbox,
  FiTrendingUp,
  FiStar,
  FiUser,
  FiMenu,
  FiBell,
  FiChevronDown,
} from "react-icons/fi";

import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserStateContext, DispatchContext } from "../App";
import { IconType } from "react-icons";
import InnerPage from "./InnerPage";

interface LinkItemProps {
  id: string;
  name: string;
  icon: IconType;
}

interface NavItemProps extends FlexProps {
  icon: IconType;
  children: React.ReactNode;
}

interface MobileProps extends FlexProps {
  onOpen: () => void;
  onLogout: () => void;
  nickname: string;
}

interface SidebarProps extends BoxProps {
  onClose: () => void;
}

const LinkItems: Array<LinkItemProps> = [
  { id: "study", name: "단어학습", icon: FiEdit2 },
  { id: "rank", name: "랭킹", icon: FiTrendingUp },
  { id: "wordbook", name: "단어장", icon: FiStar },
  { id: "grammar", name: "문법 교정", icon: FiCodesandbox },
  { id: "mypage", name: "내 정보", icon: FiUser },
];

const SidebarContent = ({ onClose, ...rest }: SidebarProps) => {
  return (
    <Box
      transition={"3s ease"}
      bg={useColorModeValue("white", "gray.900")}
      borderRight={"1px"}
      borderRightColor={useColorModeValue("gray.200", "gray.700")}
      w={{ base: "full", md: 60 }}
      pos={"fixed"}
      h={"full"}
      {...rest}
    >
      <Flex h={"20"} alignItems={"center"} mx={"8"} justifyContent={"space-between"}>
        <Text fontSize={"2xl"} fontFamily={"monospace"} fontWeight={"bold"}>
          {"🐾Wordy\r"}
        </Text>
        <CloseButton display={{ base: "flex", md: "none" }} onClick={onClose} />
      </Flex>
      {LinkItems.map((link: LinkItemProps) => (
        <NavItem key={link.name} icon={link.icon}>
          {link.name}
        </NavItem>
      ))}
    </Box>
  );
};

const NavItem = ({ icon, children, ...rest }: NavItemProps) => {
  return (
    <Box as={"a"} href={"#"} style={{ textDecoration: "none" }} _focus={{ boxShadow: "none" }}>
      <Flex
        align={"center"}
        p={"4"}
        mx={"4"}
        borderRadius={"lg"}
        role={"group"}
        cursor={"pointer"}
        _hover={{
          bg: "cyan.400",
          color: "white",
        }}
        {...rest}
      >
        {icon && (
          <Icon
            mr={"4"}
            fontSize={"16"}
            _groupHover={{
              color: "white",
            }}
            as={icon}
          />
        )}
        {children}
      </Flex>
    </Box>
  );
};

const MobileNav = ({ onOpen, nickname = "워디35", onLogout, ...rest }: MobileProps) => {
  const navigate = useNavigate();

  const navigateToMyPage = () => {
    navigate("/mypage");
  };

  return (
    <Flex
      ml={{ base: 0, md: 60 }}
      px={{ base: 4, md: 4 }}
      height={"20"}
      alignItems={"center"}
      bg={useColorModeValue("white", "gray.900")}
      borderBottomWidth={"1px"}
      borderBottomColor={useColorModeValue("gray.200", "gray.700")}
      justifyContent={{ base: "space-between", md: "flex-end" }}
      {...rest}
    >
      <IconButton
        display={{ base: "flex", md: "none" }}
        onClick={onOpen}
        variant={"outline"}
        aria-label={"open menu"}
        icon={<FiMenu />}
      />

      <Text
        display={{ base: "flex", md: "none" }}
        fontSize={"2xl"}
        fontFamily={"monospace"}
        fontWeight={"bold"}
      >
        {"🐔Wordy\r"}
      </Text>

      <HStack spacing={{ base: "0", md: "6" }}>
        <IconButton size={"lg"} variant={"ghost"} aria-label={"open menu"} icon={<FiBell />} />
        <Flex alignItems={"center"}>
          <Menu>
            <MenuButton py={2} transition={"all 0.3s"} _focus={{ boxShadow: "none" }}>
              <HStack>
                <Avatar
                  size={"sm"}
                  src={
                    "https://i.seadn.io/gae/7B0qai02OdHA8P_EOVK672qUliyjQdQDGNrACxs7WnTgZAkJa_wWURnIFKeOh5VTf8cfTqW3wQpozGedaC9mteKphEOtztls02RlWQ?auto=format&dpr=1&w=256"
                  }
                />
                <VStack
                  display={{ base: "none", md: "flex" }}
                  alignItems={"flex-start"}
                  spacing={"1px"}
                  ml={"2"}
                >
                  <Text fontSize={"sm"}>{nickname}</Text>
                  <Text fontSize={"xs"} color={"gray.600"}>
                    {"1팀\r"}
                  </Text>
                </VStack>
                <Box display={{ base: "none", md: "flex" }}>
                  <FiChevronDown />
                </Box>
              </HStack>
            </MenuButton>
            <MenuList
              bg={useColorModeValue("white", "gray.900")}
              borderColor={useColorModeValue("gray.200", "gray.700")}
            >
              <MenuItem onClick={navigateToMyPage}>{"프로필"}</MenuItem>
              <MenuItem>{"설정"}</MenuItem>
              <MenuDivider />
              <MenuItem onClick={onLogout}>{"로그아웃"}</MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </HStack>
    </Flex>
  );
};

const SidebarWithHeader = () => {
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
      <Drawer
        isOpen={isOpen}
        placement={"left"}
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size={"full"}
      >
        <DrawerContent>
          <SidebarContent onClose={onClose} />
        </DrawerContent>
      </Drawer>
      <MobileNav onOpen={onOpen} nickname={user.nickname} onLogout={handleClickLogout} />
      <Box ml={{ base: 0, md: 60 }} p={"4"}>
        <InnerPage />
      </Box>
    </Box>
  );
};

export default SidebarWithHeader;
