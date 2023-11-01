import { Box, Flex } from "@chakra-ui/react";
import BookMark from "../../../components/BookMark";

const StorageWordBox = ({ word, onBookmarkClick }) => {
  return (
    <Flex
      width="100%"
      justifyContent="space-between"
      style={{
        textAlign: "center",
        backgroundColor: "white",
        height: "100px",
        border: "1px solid #ddd",
        borderRadius: "8px",
        paddingLeft: "10px",
        paddingRight: "3px",
        marginBottom: "10px",
        transition: "background-color 0.3s ease", // Hover 시 색상 변경 애니메이션
      }}
      _hover={{
        backgroundColor: "teal.100", // Hover 상태에서 색상 변경
      }}
    >
      <Box flex={1} style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <p style={{ fontSize: "17px", fontWeight: "bold" }}>{word.word}</p>
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

export default StorageWordBox;
