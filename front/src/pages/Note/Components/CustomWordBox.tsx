import { Box, ButtonGroup, Stack, Text, useColorModeValue } from "@chakra-ui/react";
import WordInput from "../Components/WordInput";
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
              <WordInput text1={words.word} text2={words.meaning} value={words} />
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
