import {
  Box,
  FormControl,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  Stack,
  useColorModeValue,
} from "@chakra-ui/react";
import Btn from "../../../components/Btn";
import { FaDog, FaSortAlphaUp } from "react-icons/fa";

interface AddCustomNoteCardProps {
  isItAdd: boolean;
  setIsItAdd: React.Dispatch<boolean>;
  customWord: { word: string; meaning: string };
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClick: () => void | Promise<void>;
}

/** 커스텀 단어장 추가하는 카드 */
export default function AddCustomNoteCard({ isItAdd, setIsItAdd, customWord, onClick, onChange }) {
  const { word, meaning } = customWord;
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
              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <Icon as={FaSortAlphaUp} color="gray.300" boxSize={6} />
                </InputLeftElement>
                <Input
                  type="text"
                  placeholder="추가할 단어"
                  value={word}
                  name="word"
                  onChange={onChange}
                />
              </InputGroup>
            </FormControl>
            <FormControl id="mean">
              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <Icon as={FaDog} color="gray.300" boxSize={6} />
                </InputLeftElement>
                <Input
                  type="text"
                  placeholder="단어의 뜻, 의미"
                  value={meaning}
                  name="meaning"
                  onChange={onChange}
                />
              </InputGroup>
            </FormControl>
            <Btn text="단어 추가" onClick={onClick} variant="solid" type="submit" />
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
