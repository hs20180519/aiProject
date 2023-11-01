import { HStack, Input, Button } from "@chakra-ui/react";

const GrammarInputBox = ({ inputText, handleInputChange, handlePostRequest }) => {
  return (
    <HStack marginTop="30px">
      <Input
        fontSize="16px"
        size="md"
        value={inputText}
        onChange={handleInputChange}
        placeholder="문장을 입력하세요"
        isTruncated
        width="100%"
        borderColor="lightgray"
        focusBorderColor="teal.400"
      />

      <Button colorScheme="teal" onClick={handlePostRequest}>
        입력
      </Button>
    </HStack>
  );
};

export default GrammarInputBox;
