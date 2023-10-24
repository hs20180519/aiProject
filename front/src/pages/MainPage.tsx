"use client";

import {
  IconButton,
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
} from "@chakra-ui/react";

import {
  FiHome,
  FiTrendingUp,
  FiCompass,
  FiStar,
  FiSettings,
  FiMenu,
  FiBell,
  FiChevronDown,
} from "react-icons/fi";

import { IconType } from "react-icons";
import InnerPage from "./InnerPage";

interface LinkItemProps {
  name: string;
  icon: IconType;
}

interface NavItemProps extends FlexProps {
  icon: IconType;
  children: React.ReactNode;
}

interface MobileProps extends FlexProps {
  onOpen: () => void;
}

interface SidebarProps extends BoxProps {
  onClose: () => void;
}

const LinkItems: Array<LinkItemProps> = [
  { name: "홈", icon: FiHome },
  { name: "단어학습", icon: FiTrendingUp },
  { name: "Explore", icon: FiCompass },
  { name: "단어장", icon: FiStar },
  { name: "설정", icon: FiSettings },
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
          {"🐔Wordy\r"}
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

const MobileNav = ({ onOpen, ...rest }: MobileProps) => {
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
                  <Text fontSize={"sm"}>{"Elice"}</Text>
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
              <MenuItem>{"프로필"}</MenuItem>
              <MenuItem>{"설정"}</MenuItem>
              <MenuItem>{"Billing"}</MenuItem>
              <MenuDivider />
              <MenuItem>{"로그아웃"}</MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </HStack>
    </Flex>
  );
};

const SidebarWithHeader = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

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
      <MobileNav onOpen={onOpen} />
      <Box ml={{ base: 0, md: 60 }} p={"4"}>
        <InnerPage />
      </Box>
    </Box>
  );
};

export default SidebarWithHeader;
