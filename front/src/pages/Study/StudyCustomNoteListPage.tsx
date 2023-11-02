import { useState, useEffect } from "react";
import SelectCustomBox from "./component/SelectCustomBox";
import { getCustomNotes } from "../../apis/customWord";
import Loading from "../../components/Loading";
import { Flex } from "@chakra-ui/react";
export default function StudyCustomNoteListPage() {
  const [loading, setLoading] = useState(false);
  const [customNoteList, setCustomNoteList] = useState([]);
  /** 노트 목록 가져오기 */
  const fetchNoteList = async () => {
    setLoading(true);
    try {
      const res = await getCustomNotes();
      if (res.status === 200) {
        console.log(res.data);
        setCustomNoteList(res.data);
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchNoteList();
  }, []);

  if (loading) return <Loading />;

  if (customNoteList.length === 0)
    return (
      <Flex w={"100%"} height={"100%"} alignItems={"center"}>
        이런, 아직 단어장이 없네요. <br /> 나만의 단어장을 추가해주세요!
      </Flex>
    );

  return <SelectCustomBox noteList={customNoteList} />;
}
