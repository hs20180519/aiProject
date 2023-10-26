import {
  Box,
  Stack,
  Heading,
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
import { useParams } from "react-router-dom";

export default function CustomNoteDetailPage() {
  const { noteId } = useParams();
  console.log("-------디테일 페이지---------");

  return (
    <Stack>
      <Heading>{noteId}</Heading>
      <Box>
        <Text>{}</Text>
      </Box>
    </Stack>
  );
}
