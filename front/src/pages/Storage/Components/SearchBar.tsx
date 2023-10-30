// SearchBar.jsx
import React, { useState } from "react";
import { Input } from "@chakra-ui/react";

const SearchBar = ({ onSearch }) => {
  const [searchValue, setSearchValue] = useState("");

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchValue(value);
    onSearch(value);
  };

  return (
    <Input
      placeholder="단어를 검색하세요"
      value={searchValue}
      onChange={handleSearchChange}
      maxWidth="200px"
    />
  );
};

export default SearchBar;
