import { Stack, Button, Center, Text } from "@chakra-ui/react";

interface PaginationProps {
  totalPages: number;
  currentPage: number;
  handleChangePage: (pageNumber: number) => void;
}
/** 페이지네이션 컴포넌트입니다. */
export default function Pagination({ totalPages, currentPage, handleChangePage }: PaginationProps) {
  return (
    <Center>
      <Stack direction="row" mt={4}>
        <Button onClick={() => handleChangePage(currentPage - 1)} disabled={currentPage === 1}>
          이전
        </Button>
        {[...Array(totalPages)].map((_, index) => (
          <Text
            key={index}
            onClick={() => handleChangePage(index + 1)}
            color={currentPage === index + 1 ? "blue.500" : "gray.500"}
            fontWeight={currentPage === index + 1 ? "bold" : "normal"}
            cursor="pointer"
          >
            {index + 1}
          </Text>
        ))}
        <Button
          onClick={() => handleChangePage(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          다음
        </Button>
      </Stack>
    </Center>
  );
}
