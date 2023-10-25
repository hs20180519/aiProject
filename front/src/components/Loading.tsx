import { Center, Flex, Spinner } from "@chakra-ui/react";

export default function Loading() {
  return (
    <Flex>
      <Center w="100vw" h="100vh">
        <Spinner size="xl" color="cyan.500" />
      </Center>
    </Flex>
  );
}
