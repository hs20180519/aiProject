import { Box, useColorModeValue } from "@chakra-ui/react";

export default function Div(props) {
  return (
    <Box
      fontWeight="semibold"
      rounded={"lg"}
      bg={useColorModeValue("white", "gray.700")}
      boxShadow={"lg"}
      alignItems="center"
      p={8}
      height="30px"
      borderWidth="3px"
      borderRadius="lg"
      {...props}
    >
      {props.text}
    </Box>
  );
}
