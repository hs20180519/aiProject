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

const RankList = ({ rankList }: RankListProps) => {
  return (
    <>
      {rankList.map((rank: RankItemProps, index: number) => (
        <div key={rank.id}>
          {index + 1}등 {rank.nickname} {rank.score}
        </div>
      ))}
    </>
  );
};
export default RankList;
