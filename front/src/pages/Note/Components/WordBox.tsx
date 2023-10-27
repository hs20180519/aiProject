import { Box, Text, useColorModeValue, WrapItem, AbsoluteCenter } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { DeleteIcon } from "@chakra-ui/icons";
import * as type from "../../../apis/types/custom";
import { AiTwotoneStar } from "react-icons/ai";

/** 단어와 뜻을 표시하는 상자입니다. */
export default function WordBox({ words, isEditing }) {
  console.log(words[0].word);
  return (
    <>
      {words.map((word: type.WordsProps) => (
        <Box
          fontWeight="semibold"
          rounded={"lg"}
          bg={useColorModeValue("white", "gray.700")}
          boxShadow={"lg"}
          alignItems="center"
          p={8}
          height="30px"
          borderWidth="3px"
          borderRadius="lg"
          id={word.id}
        >
          <Text fontSize="xl">{word.word}</Text>
          <Text fontSize="xl">{word.meaning}</Text>
          {/* {isEditing ? (
            <DeleteIcon right="24px" position={"absolute"} />
          ) : (
            <WrapItem right="24px" position={"absolute"}>
              <AiTwotoneStar />
            </WrapItem>
          )} */}
        </Box>
      ))}
    </>
  );
}
