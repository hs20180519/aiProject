import { Box, Text, useColorModeValue, AbsoluteCenter } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { DeleteIcon } from "@chakra-ui/icons";
import * as type from "../../../apis/types/custom";

/** 단어장 상자입니다. */
export default function NoteListBox({ noteList, isEditing }: type.NoteListProps) {
  return (
    <>
      {noteList.map((note: type.NoteTitleProps) => (
        <Link to={`/main/note/${note.id}`}>
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
            <Text id={note.id}>{note.title}</Text>
            {/* </AbsoluteCenter> */}
          </Box>
        </Link>
      ))}
    </>
  );
}
