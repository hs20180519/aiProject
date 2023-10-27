import { Box, FormControl, Input, Stack, Text, Button, useColorModeValue } from "@chakra-ui/react";

/** 커스텀 단어장 추가하는 카드 */
export default function AddCustomNoteCard(isEditing, userCustomWord) {
  return (
    <>
      {isEditing && (
        <Box
          rounded={"lg"}
          bg={useColorModeValue("white", "gray.700")}
          boxShadow={"lg"}
          p={8}
          w="360px"
        >
          <Stack spacing={4}>
            <FormControl id="word">
              <Input type="text" placeholder="영어 단어" value={userCustomWord.word} />
            </FormControl>
            <FormControl id="mean">
              <Input type="text" placeholder="단어 뜻" value={userCustomWord.meaning} />
            </FormControl>
            <Stack spacing={10}>
              <Stack
                direction={{ base: "column", sm: "row" }}
                align={"start"}
                justify={"space-between"}
              ></Stack>
              <Button
                onClick={(e) => {
                  e.target;
                }}
                colorScheme="teal"
                color={"white"}
                variant="solid"
              >
                ✚
              </Button>
            </Stack>
          </Stack>
        </Box>
      )}
      {!isEditing && (
        <Box
          rounded={"lg"}
          bg={useColorModeValue("white", "gray.700")}
          boxShadow={"lg"}
          p={8}
          w="360px"
        >
          <Stack spacing={4}>
            <FormControl id="word">
              <Text>{"영어단어"}</Text>
            </FormControl>
            <FormControl id="mean">
              <Text>{"영어단어 뜻"}</Text>
            </FormControl>
          </Stack>
        </Box>
      )}
    </>
  );
}
