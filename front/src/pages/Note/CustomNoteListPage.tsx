import { useState, useEffect } from "react";
import CustomWordList from "../../components/Custom/CustomWordList";
import * as Api from "../../apis/api";

export default function CustomNoteListPage() {
  const [customWordList, setCustomWordList] = useState([]);

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
  return <CustomWordList customWordList={customWordList} />;
}
