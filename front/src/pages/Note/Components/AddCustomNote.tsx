import { Box, Stack, useColorModeValue } from "@chakra-ui/react";
import WordInput from "../Components/WordInput";
import Btn from "../../../components/Btn";

/** 커스텀 단어장 추가하는 카드 */
export default function AddCustomNoteCard({ isItAdd, setIsItAdd, customWord, onClick }) {
  return (
    <>
      {isItAdd && (
        <Box
          rounded={"lg"}
          bg={useColorModeValue("white", "gray.700")}
          boxShadow={"lg"}
          p={8}
          w="360px"
        >
          <Stack spacing={4}>
            <WordInput text1="추가할 단어" text2="단어의 뜻, 의미" value={customWord} />
            <Btn text="단어 추가" onClick={onClick} variant="solid" type="submit" />
          </Stack>
        </Box>
      )}
      {!isItAdd && (
        <Btn
          text="✚"
          onClick={() => {
            setIsItAdd(true);
          }}
        />
      )}
    </>
  );
}
