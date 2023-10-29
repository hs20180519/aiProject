import {
  Box,
  Button,
  ButtonGroup,
  FormControl,
  HStack,
  Flex,
  Input,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import Btn from "../../../components/Btn";

export default function CustomWordBox({ words, isEditing, setIsEditing }) {
  return (
    <>
      {isEditing ? (
        <>
          <Box
            rounded={"lg"}
            bg={useColorModeValue("white", "gray.700")}
            boxShadow={"lg"}
            p={8}
            w="360px"
          >
            <Stack spacing={4}>
              <Input placeholder="단어" />
              <Input placeholder="뜻, 의미" />
            </Stack>
            <ButtonGroup mt={5}>
              <Btn text="저장" onClick={() => setIsEditing((prev) => !prev)} />
              <Btn text="삭제" color="rad" onClick={() => setIsEditing((prev) => !prev)} />
            </ButtonGroup>
          </Box>
        </>
      ) : (
        <Box
          rounded={"lg"}
          bg={useColorModeValue("white", "gray.700")}
          boxShadow={"lg"}
          p={8}
          w="360px"
        >
          <Btn text="단어장 편집" onClick={() => setIsEditing((prev) => !prev)} />

          <Stack spacing={4}>
            <Text>{words.word}</Text>
            <Text>{words.meaning}</Text>
          </Stack>
        </Box>
      )}
    </>
  );
}
