import { List, ListItem, ListIcon, ListProps } from "@chakra-ui/react";
import { BsTriangleFill } from "react-icons/bs";

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
        <div key={rank.id}>
          <p>{index + 1}등</p>
          <p> {rank.nickname}</p> <p>{rank.score}</p>
        </div>
      ))}
    </>
  );
};
export default RankItem;
