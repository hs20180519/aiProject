import {
  Box,
  Badge,
  Text,
  Flex,
  Center,
  Spacer,
  useColorModeValue,
  SimpleGrid,
  Checkbox,
  Link,
} from "@chakra-ui/react";
import CustomWord from "../../apis/customWord";

export interface CustomWordProps {
  id: string;
  title: string;
}
export interface CustomWordListProps {
  customWordList: CustomWordProps[];
}

/** 유저가 갖고있는 수 만큼 */
export default function CustomWordList(
  { customWordList },
  isEditing,
  checkedItems,
  setCheckedItems: CustomWordListProps,
) {
  return (
    <SimpleGrid minChildWidth="120px" spacing="40px">
      <Box
        rounded={"lg"}
        bg={useColorModeValue("gray100", "gray.700")}
        boxShadow={"lg"}
        p={8}
        height="120px"
        borderWidth="3px"
        borderRadius="lg"
      >
        <Badge borderRadius="full" px="5" colorScheme="teal" fontSize="lg" letterSpacing="center">
          ✚ 새 단어장
        </Badge>
      </Box>
      {/* 학습한 단어 목록 */}
      <Box
        fontWeight="semibold"
        rounded={"lg"}
        bg={useColorModeValue("white", "gray.700")}
        boxShadow={"lg"}
        alignItems="center"
        p={8}
        height="120px"
        borderWidth="3px"
        borderRadius="lg"
      ></Box>
      {/* 즐겨찾기 단어 목록 */}
      <Box
        fontWeight="semibold"
        rounded={"lg"}
        bg={useColorModeValue("white", "gray.700")}
        boxShadow={"lg"}
        alignItems="center"
        p={8}
        height="120px"
        borderWidth="3px"
        borderRadius="lg"
      ></Box>
      {/* 커스텀 단어 목록 */}
      {customWordList.map((customWord: CustomWordProps) => (
        <Link href="/notes/:id">
          <Box
            key={customWord.id}
            fontWeight="semibold"
            rounded={"lg"}
            bg={useColorModeValue("white", "gray.700")}
            boxShadow={"lg"}
            p={8}
            height="120px"
            borderWidth="3px"
            borderRadius="lg"
          >
            {!isEditing && (
              <Checkbox
                position={"absolute"}
                right="30px"
                isInvalid
                mt="-5"
                // isChecked={checkedItems[0]}
                // onChange={(e) => setCheckedItems([e.target.checked, checkedItems[1]])}
              />
            )}
            <Center w="100px">
              <Text id={customWord.id}>{customWord?.title}</Text>
            </Center>
          </Box>
        </Link>
      ))}
    </SimpleGrid>
  );
}
