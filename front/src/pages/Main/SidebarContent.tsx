import { Box, CloseButton, Flex, useColorModeValue, Text, BoxProps, Link } from "@chakra-ui/react";

import { FiEdit2, FiStar, FiUser, FiCodesandbox, FiTrendingUp, FiDatabase } from "react-icons/fi";
import NavItem from "./NavItem";
import * as type from "./main.type";

const LinkItems: Array<type.LinkItemProps> = [
  { id: "study", name: "단어학습", icon: FiEdit2 },
  { id: "rank", name: "랭킹", icon: FiTrendingUp },
  { id: "grammar", name: "문법 교정", icon: FiCodesandbox },
  { id: "wordbook", name: "단어장", icon: FiStar },
  { id: "wordlist", name: "저장소", icon: FiDatabase },
  { id: "mypage", name: "내 정보", icon: FiUser },
];
export default function SidebarContent({ onClose, ...rest }: type.SidebarProps) {
  LinkItems.map((link: type.LinkItemProps) => {
    <NavItem key={link.id} icon={link.icon}>
      {link.name}
    </NavItem>;
  });
  const changComponent = (e) => {
    e.preventDefault();
    e.onChange(e.target.id);
  };
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
      {LinkItems.map((link: type.LinkItemProps) => (
        <Link href={`#${link.id}`} onClick={changComponent}>
          <NavItem key={link.id} icon={link.icon}>
            {link.name}
          </NavItem>
        </Link>
      ))}
    </Box>
  );
}
