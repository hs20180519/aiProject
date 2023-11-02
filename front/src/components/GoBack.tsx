import { Button, Icon, Box } from "@chakra-ui/react";
import { HiMiniBackspace } from "react-icons/hi2";
import { useNavigate } from "react-router";

export default function GoBack() {
  const navigate = useNavigate(); //변수 할당시켜서 사용
  const onClickBtn = () => {
    navigate(-1); // 바로 이전 페이지로 이동, '/main' 등 직접 지정도 당연히 가능
  };
  return (
    <Box position={"fixed"} mt={"144vw"} ml={"2vw"} zIndex={999}>
      <Button colorScheme="teal" onClick={onClickBtn}>
        <Icon as={HiMiniBackspace} />
      </Button>
    </Box>
  );
}
