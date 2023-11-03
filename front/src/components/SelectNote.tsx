/* eslint-disable */
import { ChangeEvent, useState } from "react";
import { Select } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import * as type from "../apis/types/custom";

interface SelectBoxProps {
  list: type.NoteProps[];
}

export default function SelectBox<T>({ list }: SelectBoxProps) {
  const navigate = useNavigate();
  const [selected, setSelected] = useState("");

  const handleSelect = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelected(e.target.value);
    if (e.target.value !== "") {
      navigate(`/main/note/${e.target.value}`);
    }
  };

  return (
    <Select bg="teal.400" placeholder="단어장 선택하기" onChange={handleSelect} mr={15} w={"100%"}>
      <option value={"correct"}>{"🐶학습한 단어"}</option>
      <option value={"incorrect"}>{"📃틀린 단어"}</option>
      <option value={"favorite"}>{"⭐️즐겨찾기"}</option>
      {list.map((note: any) => (
        <option value={note.id}>{note.title}</option>
      ))}
    </Select>
  );
}
