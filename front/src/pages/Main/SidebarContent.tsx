import { Box, CloseButton, Flex, useColorModeValue, Text, BoxProps } from "@chakra-ui/react";

import { FiEdit2, FiStar, FiUser, FiCodesandbox, FiTrendingUp } from "react-icons/fi";
import NavItem from "./NavItem";
import * as type from "./main.type";

interface SidebarProps extends BoxProps {
  onClose: () => void;
}
const LinkItems: Array<type.LinkItemProps> = [
  { id: "study", name: "단어학습", icon: FiEdit2 },
  { id: "rank", name: "랭킹", icon: FiTrendingUp },
  { id: "wordbook", name: "단어장", icon: FiStar },
  { id: "grammar", name: "문법 교정", icon: FiCodesandbox },
  { id: "mypage", name: "내 정보", icon: FiUser },
];

export default function SidebarContent({ onClose, ...rest }: SidebarProps) {
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
        <NavItem key={link.name} icon={link.icon}>
          {link.name}
        </NavItem>
      ))}
    </Box>
  );
}
