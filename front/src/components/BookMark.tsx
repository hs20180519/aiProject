import { Icon } from "@chakra-ui/react";
import { PiStarFill, PiStarDuotone } from "react-icons/pi";

/** 북마크 :
 * favorite true -> 꽉찬 별,
 * favorite false -> 빈 별 */
const BookMark = ({ favorite, onClick }) => {
  return (
    <>
      {favorite ? (
        <Icon as={PiStarFill} boxSize={5} color={"yellow.400"} onClick={onClick} />
      ) : (
        <Icon as={PiStarDuotone} boxSize={5} color={"yellow.300"} onClick={onClick} />
      )}
    </>
  );
};

export default BookMark;
