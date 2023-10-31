import React, { useState } from "react";
import { Input, Flex, InputGroup, InputLeftAddon, IconButton } from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
/** 검색창 */
const SearchBar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (searchTerm) => {
    onSearch(searchTerm);
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    handleSearch(value); // 입력이 바뀔 때마다 즉시 검색
  };

  return (
    <Flex align="center" mt={4} mb={4}>
      <IconButton colorScheme="teal" aria-label="Search database" icon={<SearchIcon />} />
      <Input
        value={searchTerm}
        onChange={handleChange}
        placeholder="검색할 영단어를 입력하세요"
        focusBorderColor="teal.400"
      />
    </Flex>
  );
};

export default SearchBar;
