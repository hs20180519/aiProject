import { Box, Text, useColorModeValue, AbsoluteCenter, Icon } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { DeleteIcon } from "@chakra-ui/icons";
import { FaRegTrashAlt } from "react-icons/fa";
import Btn from "../../../components/Btn";
import { Fragment } from "react";

interface NoteProps {
  id: string;
  title: string;
}
interface NoteListBoxProps {
  noteList: NoteProps[];
  isEditing: boolean;
  onDelete?: (note_id: string) => Promise<void>;
}

/** 단어장 상자입니다. */
export default function NoteListBox({ noteList, isEditing, onDelete }: NoteListBoxProps) {
  return (
    <>
      {noteList.map((note: NoteProps) => (
        <Fragment key={note.id}>
          {isEditing ? (
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
              <Btn
                key={note.id}
                colorScheme="teal"
                value={note.id}
                onClick={() => onDelete(note.id)}
                text={<Icon as={FaRegTrashAlt} />}
                position="absolute"
                right={7}
                mt="-5"
              ></Btn>
              <Text id={note.id} fontSize={"xl"}>
                {note.title}
              </Text>
            </Box>
          ) : (
            <Link to={`/main/note/${note.id}`}>
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
          )}
        </Fragment>
      ))}
    </>
  );
}
