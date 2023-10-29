import styled from "@emotion/styled";
import {
  ListProps,
  Box,
  Flex,
  Center,
  Text,
  Square,
  Spacer,
  Grid,
  useColorModeValue,
} from "@chakra-ui/react";

interface RankListProps extends ListProps {
  rankList: RankItemProps[];
}

export interface RankItemProps {
  id: number;
  nickname: string;
  score: number;
}

const RankItem = ({ rankList }: RankListProps) => {
  // const topThree = ()=>{
  //   const topUserGroup = [];
  //   for (let i = 0; i++; i<3){
  //     topUserGroup.push(
  //       <Grid templateColumns="repeat(3, 1fr)" gap={2} p={4}>
  //         <Box
  //           key={rankList.id}
  //           bg="white"
  //           w="30%"
  //           fontWeight="semibold"
  //           rounded={"lg"}
  //           boxShadow={"lg"}
  //           alignItems="center"
  //           p={8}
  //         >
  //           <Text>{index + 1}등</Text>
  //         </Box>

  //         <Box
  //           bg="white"
  //           fontWeight="semibold"
  //           rounded={"lg"}
  //           boxShadow={"lg"}
  //           alignItems="center"
  //           p={8}
  //         >
  //           <Text> {rankList[0].nickname}</Text>
  //         </Box>

  //         <Box
  //           key={rankList[0].id}
  //           bg="white"
  //           fontWeight="semibold"
  //           rounded={"lg"}
  //           boxShadow={"lg"}
  //           alignItems="center"
  //           p={8}
  //         >
  //           <Text>{rankList[0].score}</Text>
  //         </Box>
  //       </Grid>)

  //   }
  // }
  return (
    <>
      {rankList.map((rank: RankItemProps, index: number) => (
        <Grid templateColumns="repeat(3, 1fr)" gap={2} p={4}>
          <Box
            key={rank.id}
            bg={rank.id <= 3 ? "teal.300" : "yellow.100"}
            w={"20%"}
            fontWeight="semibold"
            rounded={"lg"}
            boxShadow={"lg"}
            borderRadius="full"
            alignItems="center"
            p={8}
          >
            {index + 1}등
          </Box>

          <Box
            bg="white"
            fontWeight="semibold"
            rounded={"lg"}
            boxShadow={"lg"}
            alignItems="center"
            p={8}
          >
            <Text> {rank.nickname}</Text>
          </Box>

          <Box
            key={rank.id}
            bg="white"
            fontWeight="semibold"
            rounded={"lg"}
            boxShadow={"lg"}
            alignItems="center"
            p={8}
          >
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
