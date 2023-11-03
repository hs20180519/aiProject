import { ListProps, Box, Stack, Avatar, Text } from "@chakra-ui/react";

interface RankListProps extends ListProps {
  rankList: RankItemProps[];
  currentPage: number;
}

export interface RankItemProps {
  id: number;
  name: string;
  nickname: string;
  rank: number;
  score: number;
  profileImage: string;
}

const changeBackgroudColor = (index) => {
  switch (index) {
    case 0:
      return "orange";
    case 1:
      return "gray.300";
    case 2:
      return "yellow.100";
    default:
      return "white";
  }
};

const RankItem = ({ rankList, currentPage }: RankListProps) => {
  return (
    <>
      {rankList.map((rank: RankItemProps, index: number) => (
        <Box
          key={rank.id}
          bg={changeBackgroudColor(index)}
          fontFamily={"Elice DX Neolli"}
          fontWeight="semibold"
          rounded={"lg"}
          boxShadow={"lg"}
          borderRadius="full"
          alignItems="center"
          h={30}
          p={8}
          mt={2}
        >
          <Stack direction="row" mt={-3}>
            <Text color={"teal.400"}>{index + 1 + 10 * (currentPage - 1)}등</Text>
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
            <Text color={"gray.600"}>{rank.name || rank.nickname}</Text>
            <Text color={"teal.400"} position={"absolute"} right={12}>
              {rank.score}점
            </Text>
          </Stack>
        </Box>
      ))}
    </>
  );
};

export default RankItem;
