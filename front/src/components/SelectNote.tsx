import { Select } from "@chakra-ui/react";
import { Link } from "react-router-dom";

export default function SelectNote({ onSelect, category, customNote }) {
  return (
    <Select
      bg="teal.300"
      color="white"
      placeholder="단어장 선택하기"
      onChange={onSelect}
      mr={15}
      w={"100%"}
    >
      {category.map((category) => (
        <Link to={`main/note/${category.title}`}>
          <option value={category.id}>{category.title}</option>
        </Link>
      ))}
      {customNote.map((custom) => (
        <Link to={`main/note/${custom.id}`}>
          <option value={custom.id}>{custom.title}</option>
        </Link>
      ))}
    </Select>
  );
}
