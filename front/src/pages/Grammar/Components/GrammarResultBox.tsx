import { VStack, Box } from "@chakra-ui/react";

const GrammarResultBox = ({ responseData }) => {
  return (
    <VStack align="start" spacing={4}>
      <Box marginTop="15px" fontSize={"15px"} textAlign="left">
        교정된 문장 :
      </Box>
      <Box
        fontSize="16px"
        border="1px"
        p={4}
        borderRadius="md"
        width="100%"
        height="250px"
        overflow="auto"
        borderColor="lightgray"
        textAlign="left"
        marginBottom="15px"
      >
        {responseData}
      </Box>
    </VStack>
  );
};

export default GrammarResultBox;
