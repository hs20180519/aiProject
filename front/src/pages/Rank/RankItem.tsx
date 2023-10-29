import styled from "@emotion/styled";
import { ListProps, Box, Flex, Center, Text, Square, Spacer, Grid } from "@chakra-ui/react";

interface RankListProps extends ListProps {
  rankList: RankItemProps[];
}

export interface RankItemProps {
  id: number;
  nickname: string;
  score: number;
}

const RankItem = ({ rankList }: RankListProps) => {
  return (
    <>
      {rankList.map((rank: RankItemProps, index: number) => (
        <Grid templateColumns="repeat(3, 1fr)" gap={6}>
          <Box key={rank.id} w="100px" bg="white">
            <Text>{index + 1}등</Text>
          </Box>
          <Spacer />
          <Box w="100px">
            <Text> {rank.nickname}</Text>
          </Box>
          <Spacer />
          <Box key={rank.id} w="100px">
            <Text>{rank.score}</Text>
          </Box>
        </Grid>
      ))}
    </>
  );
};
export default RankItem;

const StyledContainer = styled.div`
  width: 100%;
  height: 100%;
`;

const StyledWrapper = styled.div`
  width: 100%;
  height: 100%;
  padding: 64px;
`;

const StyledFlexbox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;
