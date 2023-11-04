import { Button } from "@chakra-ui/react";

function Btn(props) {
  return (
    <Button colorScheme={props.color || "teal"} {...props}>
      {props.text}
    </Button>
  );
}

export default Btn;
