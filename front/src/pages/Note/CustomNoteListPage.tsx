import { useState, useEffect } from "react";
import CustomWordList from "./CustomNoteList.component";
import { Flex, Spacer, Box, Heading, ButtonGroup, Button } from "@chakra-ui/react";
import * as Api from "../../apis/api";

export default function CustomNoteListPage() {
  const [customWordList, setCustomWordList] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [checkedItems, setCheckedItems] = useState([false, false]);
  const allChecked = checkedItems.every(Boolean);

  const fetchCustomWordList = async () => {
    try {
      // fetch
      const res = await Api.get("/book");
      console.log("---------------book list---------");
      console.log(res);
      if (res.status === 200) {
        setCustomWordList(res.data);
      }
    } catch (e) {
      // error
      console.log("-------error--------");
    }
  };

  useEffect(() => {
    fetchCustomWordList();
  }, []);
  return (
    <>
      <Flex minWidth="max-content" alignItems="center" gap="2" mb="5">
        <Box p="2">
          <Heading size="md">내 단어장</Heading>
        </Box>
        <Spacer />
        {!isEditing && (
          <Button
            colorScheme="teal"
            onChange={(e) => {
              setIsEditing(true);
            }}
          >
            단어장 편집
          </Button>
        )}
        {isEditing && (
          <ButtonGroup>
            <Button
              colorScheme="red"
              onClick={(e) => {
                allChecked;
              }}
            >
              전체 선택
            </Button>
            <Button
              colorScheme="red"
              onChange={(e) => {
                //단어장 삭제 로직
                setIsEditing(false);
              }}
            >
              단어장 삭제
            </Button>
          </ButtonGroup>
        )}
      </Flex>
      <CustomWordList customWordList={customWordList} />
    </>
  );
}
