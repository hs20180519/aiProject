import { Input as ChakraInput, InputGroup, InputLeftElement, InputProps } from "@chakra-ui/react";
import { MdSearch } from "react-icons/md";
const Input = (props: InputProps) => {
  return (
    <InputGroup>
      <InputLeftElement pointerEvents="none">
        <MdSearch />
      </InputLeftElement>
      <ChakraInput {...props} />
    </InputGroup>
  );
};

export default Input;
