import {
  Box,
  Badge,
  Text,
  Flex,
  Center,
  Spacer,
  useColorModeValue,
  SimpleGrid,
  Checkbox,
  AbsoluteCenter,
} from "@chakra-ui/react";

import { Link } from "react-router-dom";

import { DeleteIcon } from "@chakra-ui/icons";
import CustomWord from "../../apis/customWord";

export interface CustomWordProps {
  id: string;
  title: string;
}
export interface CustomWordListProps {
  customWordList: CustomWordProps[];
  isEditing: boolean;
}

/** 유저가 갖고있는 수 만큼 */
export default function CustomWordList({ customWordList, isEditing }: CustomWordListProps) {
  return (
    <>
      {customWordList.map((customWord: CustomWordProps) => (
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

            <AbsoluteCenter>
              <Text id={customWord.id}>{customWord.title}</Text>
            </AbsoluteCenter>
          </Box>
        </Link>
      ))}
    </>
  );
}
