import StarImg from "../Assets/star.png";
import EmptyStarImg from "../Assets/empty-star.png";

const BookMark = ({ favorite, onClick }) => {
  return (
    <img
      src={favorite ? StarImg : EmptyStarImg}
      alt={favorite ? "star" : "empty star"}
      onClick={onClick}
      style={{ cursor: "pointer", width: "20px", height: "20px" }}
    />
  );
};
export default BookMark;
