import { Box, FormControl, Input, Stack, Text, Button, useColorModeValue } from "@chakra-ui/react";
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
            <FormControl id="word">
              <Input id="word" type="text" placeholder="추가할 단어" value={customWord.word} />
            </FormControl>
            <FormControl id="mean">
              <Input
                id="meaning"
                type="text"
                placeholder="추가할 단어의 뜻, 의미"
                value={customWord.meaning}
              />
            </FormControl>
            <Stack spacing={10}>
              <Btn text="단어 추가" onClick={onClick} variant="solid" />
            </Stack>
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
