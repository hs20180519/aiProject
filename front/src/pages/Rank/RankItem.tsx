import styled from "@emotion/styled";
import { ListProps, Box } from "@chakra-ui/react";

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
        <Box key={rank.id}>
          <p>{index + 1}등</p>
          <p> {rank.nickname}</p> <p>{rank.score}</p>
        </Box>
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
