import { FormControl, InputGroup, InputLeftElement, Icon, Input } from "@chakra-ui/react";
import { FaLanguage, FaSortAlphaUp, FaDog } from "react-icons/fa";

interface InputProps {
  value: { word: string; meaning: string };
  text1: string;
  text2: string;
}

export default function WordInput(props: InputProps) {
  return (
    <>
      <FormControl id="word">
        <InputGroup>
          <InputLeftElement pointerEvents="none">
            <Icon as={FaSortAlphaUp} color="gray.300" boxSize={6} />
          </InputLeftElement>
          <Input id="word" type="text" placeholder={props.text1} value={props.value.word} />
        </InputGroup>
      </FormControl>
      <FormControl id="mean">
        <InputGroup>
          <InputLeftElement pointerEvents="none">
            <Icon as={FaDog} color="gray.300" boxSize={6} />
          </InputLeftElement>
          <Input id="meaning" type="text" placeholder={props.text2} value={props.value.meaning} />
        </InputGroup>
      </FormControl>
    </>
  );
}
