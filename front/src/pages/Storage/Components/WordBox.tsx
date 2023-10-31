import { Box, Flex } from "@chakra-ui/react";
import BookMark from "../../../components/BookMark";

const WordBox = ({ word, onBookmarkClick }) => {
  return (
    <Flex
      width="100%"
      justifyContent="center"
      style={{
        textAlign: "center",
        backgroundColor: "white",
        height: "100px",
        border: "1px solid #ddd",
        borderRadius: "5px",
        padding: "10px",
        marginBottom: "10px",
      }}
    >
      <Box flex={1} style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <p style={{ fontSize: "20px" }}>{word.word}</p>
        <p style={{ color: "gray" }}>{word.meaning}</p>
      </Box>
      <Box>
        <BookMark
          favorite={word.isFavorite}
          onClick={() => {
            onBookmarkClick(word.id, word.isFavorite);
          }}
        />
      </Box>
    </Flex>
  );
};

export default WordBox;
