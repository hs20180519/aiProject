import { Box, Text, useColorModeValue, AbsoluteCenter } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { DeleteIcon } from "@chakra-ui/icons";
import * as type from "../../../apis/types/custom";

/** 유저가 갖고있는 수 만큼 */
export default function NoteListBox({ noteList, isEditing }: type.NoteListProps) {
  return (
    <>
      {noteList.map((customWord: type.NoteTitleProps) => (
        <Link to={`/main/notes/${customWord.id}`}>
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
          >
            {isEditing && <DeleteIcon right="24px" position={"absolute"} />}
            {/* <AbsoluteCenter> */}
            <Text id={customWord.id}>{customWord.title}</Text>
            {/* </AbsoluteCenter> */}
          </Box>
        </Link>
      ))}
    </>
  );
}
