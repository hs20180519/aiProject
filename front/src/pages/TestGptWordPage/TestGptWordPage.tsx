import React, { useState, useCallback, useEffect } from "react";
import { Box, Button, Flex, Spinner, Tag, useToast } from "@chakra-ui/react";
import { InputDialogData } from "../../apis/gpt_interface";
import { FetchGpt } from "../../apis/gpt";
import ScriptDialog from "./components/ScriptDialog";
import { FetchStudyWords } from "../../apis/studyWord";

const TestGptWordPage = () => {
  const [selectedWords, setSelectedWords] = useState([]);
  const [isScriptLoading, setScriptLoading] = useState(false);
  const [scriptResult, setScriptResult] = useState(null);
  const [isGrammarLoading, setGrammarLoading] = useState(false);

  const toast = useToast();

  const [dynamicWordList, setDynamicWordList] = useState({});

  useEffect(() => {
    const fetchWords = async () => {
      try {
        const result = await FetchStudyWords.getLearnResultWithGpt("?userId=1");
        const newWordList = result.reduce(
          (obj: { [x: string]: string }, item: { word: { word: string; meaning: string } }) => {
            obj[item.word.word] = item.word.meaning;
            return obj;
          },
          {},
        );
        setDynamicWordList(newWordList);
      } catch (error) {
        console.log("Error fetching words:", error);
      }
    };

    fetchWords();
  }, []);

  const handleTagClick = useCallback(
    (word) => {
      if (selectedWords.includes(word)) {
        // 이미 선택된 단어를 다시 클릭한 경우: 선택 취소
        const newSelectedWords = selectedWords.filter((w) => w !== word);
        setSelectedWords(newSelectedWords);
      } else {
        // 새로운 단어를 선택하는 경우
        if (selectedWords.length >= 3) {
          toast({
            title: "단어는 3개까지 선택 가능 합니다.",
            status: "error",
            duration: 5000,
            isClosable: true,
          });
          return;
        }

        const newSelectedWords = [...selectedWords, word];
        setSelectedWords(newSelectedWords);
      }
    },
    [selectedWords, toast],
  );

    const handleGetScript = useCallback(async () => {
    console.log("handleGetScript 실행, 현재 selectedWords:", selectedWords);
    setScriptLoading(true);
    try {
      const updatedDialogParams: InputDialogData = {
        line_count: selectedWords.length + 2,
        word_pairs: selectedWords.reduce((obj, word) => {
          return { ...obj, [word]: dynamicWordList[word] };
        }, {}),
      };

      console.log("API 호출 전, updatedDialogParams:", updatedDialogParams);
      const apiResult = await FetchGpt.getScript(updatedDialogParams);

      toast({
        title: "Script fetch successful.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      console.log("API 호출 결과:", apiResult);
      setScriptResult(JSON.stringify(apiResult));
    } catch (error) {
      toast({
        title: "Script fetch failed.",
        description: `Error: ${error.message || error}`,
        status: "error",
        duration: 5000,
        isClosable: true,
      });

      console.log("API 호출 실패:", error);
      // setScriptResult(`Failed to fetch script: ${error.message || error}`);
    } finally {
      setScriptLoading(false);
    }
  }, [selectedWords, dynamicWordList, toast]);

  return (
    <Flex direction="column" align="center" justify="flex-start" height="100vh">
      <Box maxW="sm" p={4} borderWidth={1} borderRadius="lg">
        <Box>
          {Object.keys(dynamicWordList).map((word) => (
            <Tag
              key={word}
              size="md"
              variant={selectedWords.includes(word) ? "solid" : "outline"}
              colorScheme="teal"
              m={1}
              onClick={() => handleTagClick(word)}
            >
              {word}
            </Tag>
          ))}
        </Box>
        <Button mt={4} onClick={handleGetScript} isDisabled={isGrammarLoading || isScriptLoading}>
          {isScriptLoading ? <Spinner /> : "대화 생성하기"}
        </Button>
        <Box mt={4} maxW="sm">
          {scriptResult ? (
            <ScriptDialog
              dialogResult={JSON.parse(scriptResult)}
              isGrammarLoading={isGrammarLoading}
              setGrammarLoading={setGrammarLoading}
              isScriptLoading={isScriptLoading}
            />
          ) : null}
        </Box>
      </Box>
    </Flex>
  );
};

export default TestGptWordPage;
