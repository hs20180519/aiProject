import { Stack, Button, Center, Text } from "@chakra-ui/react";
import { FaAngleDoubleLeft, FaAngleDoubleRight, FaAngleLeft, FaAngleRight } from "react-icons/fa";

interface PaginationProps {
  pagingIndex: number;
  limit: number;
  totalPage: number;
  currentPage: number;
  handleChangePage: (pageNumber: number) => void;
  handleChangePaginIndex: (pagingIndex: number) => void;
}

// todo 새로고침 해결하기
/** 페이지네이션 컴포넌트입니다. */
export default function Pagination({
  pagingIndex,
  limit,
  currentPage,
  totalPage,
  handleChangePage,
  handleChangePaginIndex,
}: PaginationProps) {
  const range = pagingIndex === 1 ? 0 : (pagingIndex - 1) * limit;
  const lastLimit = totalPage - range >= limit ? limit : totalPage % limit;

  return (
    <Center>
      <Stack direction="row" mt={4} alignItems="center">
        <Button
          onClick={() => {
            handleChangePage(1);
            handleChangePaginIndex(1);
          }}
          padding={0}
          isDisabled={pagingIndex === 1}
        >
          <FaAngleDoubleLeft />
        </Button>
        <Button
          onClick={() => {
            if (currentPage === range + 1) {
              handleChangePage(range);
              handleChangePaginIndex(pagingIndex - 1);
            } else {
              handleChangePage(currentPage - 1);
            }
          }}
          isDisabled={currentPage === 1}
          padding={0}
        >
          <FaAngleLeft />
        </Button>
        {[...Array(lastLimit)].map((_, index) => (
          <Text
            key={index}
            onClick={() => handleChangePage(index + 1 + range)}
            color={currentPage === index + 1 + range ? "blue.500" : "gray.500"}
            fontWeight={currentPage === index + 1 + range ? "bold" : "normal"}
            cursor="pointer"
          >
            {index + 1 + range}
          </Text>
        ))}
        <Button
          onClick={() => {
            handleChangePage(currentPage + 1);
            if (currentPage === lastLimit * pagingIndex) {
              handleChangePaginIndex(pagingIndex + 1);
            }
          }}
          isDisabled={totalPage === currentPage}
        >
          <FaAngleRight />
        </Button>
        <Button
          onClick={() => {
            handleChangePage(totalPage);
            handleChangePaginIndex(Math.ceil(totalPage / limit));
          }}
          isDisabled={totalPage === currentPage}
        >
          <FaAngleDoubleRight />
        </Button>
      </Stack>
    </Center>
  );
}
