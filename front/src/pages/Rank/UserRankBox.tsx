import { ListProps, Box, Stack, Avatar, Text } from "@chakra-ui/react";

export default function UserRankBox(rank) {
  return (
    <>
      <Box
        key={rank.id}
        bg={"gray.300"}
        fontWeight="semibold"
        boxShadow={"lg"}
        alignItems="center"
        w={400}
        left={-0}
        p={6}
        mt={452}
        position={"absolute"}
        display={"flex"}
        zIndex={"999"}
      >
        <Stack direction="row">
          <Text color={"teal.400"}>등수</Text>
          <Avatar
            size={"sm"}
            ml={2}
            mr={3}
            src={
              rank?.profileImage
                ? rank.profileImage
                : "https://i.seadn.io/gae/7B0qai02OdHA8P_EOVK672qUliyjQdQDGNrACxs7WnTgZAkJa_wWURnIFKeOh5VTf8cfTqW3wQpozGedaC9mteKphEOtztls02RlWQ?auto=format&dpr=1&w=256"
            }
          />
          <Text>유저이름</Text>
          <Text color={"teal.400"} position={"absolute"} right={12}>
            점수
          </Text>
        </Stack>
      </Box>
    </>
  );
}
