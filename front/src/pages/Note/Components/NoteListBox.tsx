import { Box, Text, useColorModeValue, AbsoluteCenter, Icon } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { DeleteIcon } from "@chakra-ui/icons";
import { FaRegTrashAlt } from "react-icons/fa";
import * as type from "../../../apis/types/custom";
import Btn from "../../../components/Btn";

/** 단어장 상자입니다. */
export default function NoteListBox({ noteList, isEditing, onClick }: type.NoteListProps) {
  return (
    <>
      {noteList.map((note: type.NoteTitleProps) => (
        <>
          {isEditing ? (
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
              {isEditing && (
                <Btn
                  colorScheme="teal"
                  value={note}
                  onClick={onClick}
                  text={<Icon as={FaRegTrashAlt} />}
                  position="fix"
                  left="30x"
                  mt="-6"
                ></Btn>
              )}
              {/* <AbsoluteCenter> */}
              <Text id={note.id}>{note.title}</Text>
              {/* </AbsoluteCenter> */}
            </Box>
          ) : (
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
                {/* <AbsoluteCenter> */}
                <Text id={note.id}>{note.title}</Text>
                {/* </AbsoluteCenter> */}
              </Box>
            </Link>
          )}
        </>
      ))}
    </>
  );
}
