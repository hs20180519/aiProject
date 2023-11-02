import { Box, Flex } from "@chakra-ui/react";
import BookMark from "../../../components/BookMark";

const StorageWordBox = ({ word, onBookmarkClick }) => {
  return (
    <Flex
      width="100%"
      style={{
        backgroundColor: "white",
        height: "100px",
        border: "1px solid #ddd",
        borderRadius: "8px",
        flexDirection: "column",
      }}
    >
      <Box width="100%" textAlign="end">
        <BookMark
          favorite={word.isFavorite}
          onClick={() => {
            onBookmarkClick(word.id, word.isFavorite);
          }}
        />
      </Box>

      <Box width="100%" textAlign="center">
        <p style={{ fontSize: "17px", fontWeight: "bold" }}>{word.word}</p>
        <p style={{ color: "gray" }}>{word.meaning}</p>
      </Box>
    </Flex>
  );
};

export default StorageWordBox;
