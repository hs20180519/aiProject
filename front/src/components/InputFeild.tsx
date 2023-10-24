import { Input as ChakraInput, InputProps } from "@chakra-ui/react";

/** 유저가 만든 문장 입력하는 컴포넌트입니다. */

const Input = (props: InputProps) => {
  return <ChakraInput {...props} />;
};

export default Input;
