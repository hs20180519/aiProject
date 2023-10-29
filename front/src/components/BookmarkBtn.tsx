import { PiStarDuotone, PiStarFill } from "react-icons/pi";
export default function BookmarkBtn(isBookmarked) {
  return (
    <div style={{ position: "absolute", right: 40 }}>
      {isBookmarked ? <PiStarDuotone /> : <PiStarFill />}
    </div>
  );
}
