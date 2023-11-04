import { Button, Icon } from "@chakra-ui/react";
import { PiStarFill, PiStarDuotone } from "react-icons/pi";

/** 북마크 :
 * favorite true -> 꽉찬 별,
 * favorite false -> 빈 별 */

const BookMark = ({ favorite, onClick }) => {
  return (
    <Button onClick={onClick} padding={0} variant="ghost">
      <Icon as={favorite ? PiStarFill : PiStarDuotone} boxSize={4} color={"yellow.400"} />
    </Button>
  );
};

export default BookMark;
