import { Icon } from "@chakra-ui/react";
import { PiStarDuotone, PiStarFill } from "react-icons/pi";

export default function BookmarkBtn(isBookmarked) {
  return (
    <div style={{ position: "absolute", right: 40 }}>
      {isBookmarked ? (
        <Icon as={PiStarDuotone} boxSize={8} color={"yellow.500"} />
      ) : (
        <Icon as={PiStarFill} boxSize={8} color={"yellow.300"} />
      )}
    </div>
  );
}
