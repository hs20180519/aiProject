import { Select } from "@chakra-ui/react";

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
        <option value={category.id}>{category.title}</option>
      ))}
      {customNote.map((custom) => (
        <option value={custom.id}>{custom.title}</option>
      ))}
    </Select>
  );
}
