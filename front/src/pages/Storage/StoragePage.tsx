import React, { useEffect, useState } from "react";
import * as instance from "../../apis/api";

// todo : 페이지네이션

interface Word {
  id: number;
  word: string;
  meaning: string;
  category: string;
}

const Storage: React.FC = () => {
  const [wordData, setWordData] = useState<Word[]>([]); // Word 타입의 배열로 상태를 초기화합니다.

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await instance.get(`/storage`);
        // 여기서 결과(response)를 처리하거나 상태에 저장할 수 있습니다.
        if (response.data && Array.isArray(response.data.words)) {
          // 받아온 데이터를 상태에 저장합니다.
          setWordData(response.data.words);
        }
      } catch (error) {
        // 오류가 발생했을 때 처리할 코드를 넣으세요.
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const renderWords = () => {
    const renderedData = [];
    for (let i = 0; i < wordData.length; i += 2) {
      renderedData.push(
        <div key={i} style={{ display: "flex" }}>
          <div
            style={{
              width: "50%",
              backgroundColor: "white",
              border: "1px solid #ddd",
              borderRadius: "5px",
              padding: "10px",
              margin: "10px",
            }}
          >
            <p>Word: {wordData[i].word}</p>
            <p>Meaning: {wordData[i].meaning}</p>
            <p>Category: {wordData[i].category}</p>
          </div>
          {wordData[i + 1] && (
            <div
              style={{
                width: "50%",
                backgroundColor: "white",
                border: "1px solid #ddd",
                borderRadius: "5px",
                padding: "10px",
                margin: "10px",
              }}
            >
              <p>Word: {wordData[i + 1].word}</p>
              <p>Meaning: {wordData[i + 1].meaning}</p>
              <p>Category: {wordData[i + 1].category}</p>
            </div>
          )}
        </div>,
      );
    }
    return renderedData;
  };
  return <div>{renderWords()}</div>;
};

export default Storage;
