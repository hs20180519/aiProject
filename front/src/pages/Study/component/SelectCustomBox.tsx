import { Box, useColorModeValue, Text } from "@chakra-ui/react";
import { Link } from "react-router-dom";

interface NoteProps {
  id: string;
  title: string;
}

interface SelectCustomBoxProps {
  noteList: NoteProps[];
}

export default function SelectCustomBox({ noteList }: SelectCustomBoxProps) {
  return (
    <>
      {noteList.map((note) => (
        <Box>
          <Link to={`/main/custom/${note.id}`}>
            <Box
              fontWeight="semibold"
              rounded={"lg"}
              bg={useColorModeValue("white", "gray.700")}
              boxShadow={"lg"}
              alignItems="center"
              p={7}
              height="90px"
              borderWidth="3px"
              borderRadius="lg"
            >
              <Text id={note.id} fontSize={"xl"}>
                {note.title}
              </Text>
            </Box>
          </Link>
        </Box>
      ))}
    </>
  );
}

// 내 단어장으로 학습하기 -> custom list 가 보임 Note list를 클릭하면 -> 학습시작 custom study: note_id
