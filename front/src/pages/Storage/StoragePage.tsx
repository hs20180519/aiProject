import React, { useEffect, useState } from "react";
import * as instance from "../../apis/api";

const Storage: React.FC = () => {
  const [wordData, setWordData] = useState<string[]>([]); // 데이터를 저장할 상태
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await instance.get(`/book/word`);
        // 여기서 결과(response)를 처리하거나 상태에 저장할 수 있습니다.
        const words = response.data.words.map(
          () => `Word: ${words.word}, Meaning: ${words.meaning}`,
        );
        setWordData(words); // 가공한 데이터를 상태에 저장합니다.
      } catch (error) {
        // 오류가 발생했을 때 처리할 코드를 넣으세요.
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      {wordData.map((word, index) => (
        <div
          key={index}
          style={{ border: "1px solid #ddd", borderRadius: "5px", padding: "10px", margin: "10px" }}
        >
          <p>{word}</p>
        </div>
      ))}
    </div>
  );
};

export default Storage;
