import { Button } from "@chakra-ui/react";
import { useNavigate } from "react-router";

export default function GoBack() {
  const navigate = useNavigate(); //변수 할당시켜서 사용
  const onClickBtn = () => {
    navigate(-1); // 바로 이전 페이지로 이동, '/main' 등 직접 지정도 당연히 가능
  };
  return <Button colorScheme="teal" onClick={onClickBtn}></Button>;
}
