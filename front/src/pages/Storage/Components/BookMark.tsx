import { Icon } from "@chakra-ui/react";
import { StarIcon } from "@chakra-ui/icons"; // Import the StarIcon from Chakra UI
import { PiStarFill, PiStarDuotone } from "react-icons/pi";

const BookMark = ({ favorite, onClick }) => {
  return (
    <>
      {favorite ? (
        <Icon as={PiStarFill} boxSize={6} color={"yellow.500"} onClick={onClick} />
      ) : (
        <Icon as={PiStarDuotone} boxSize={6} color={"yellow.500"} onClick={onClick} />
      )}
    </>
  );
};

export default BookMark;
