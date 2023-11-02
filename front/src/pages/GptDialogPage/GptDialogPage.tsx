import React, { useState, useCallback, useEffect } from "react";
import { Tooltip, Text, Box, Button, Flex, Spinner, Tag, useToast } from "@chakra-ui/react";
import { InputDialogData } from "../../apis/gpt_interface";
import { FetchGpt } from "../../apis/gpt";
import ScriptDialog from "./components/ScriptDialog";
import { FetchStudyWords } from "../../apis/studyWord";

const GptDialogPage = () => {
  const [selectedWords, setSelectedWords] = useState({});
  const [isScriptLoading, setScriptLoading] = useState(false);
  const [scriptResult, setScriptResult] = useState(null);
  const [isGrammarLoading, setGrammarLoading] = useState(false);
  const [isWordsLoading, setWordsLoading] = useState(true);

  const toast = useToast();

  const [dynamicWordList, setDynamicWordList] = useState({});

  useEffect(() => {
    const fetchWords = async () => {
      try {
        setWordsLoading(true);
        const result = await FetchStudyWords.getLearnResult();
        const newWordList = result.data.reduce(
          (obj: { [x: string]: string }, item: { word: { word: string; meaning: string } }) => {
            obj[item.word.word] = item.word.meaning;
            return obj;
          },
          {},
        );
        setDynamicWordList(newWordList);
      } catch (error) {
        console.log("Error fetching words:", error);
      } finally {
        setWordsLoading(false);
      }
    };

    fetchWords();
  }, []);

  const handleTagClick = useCallback(
    (word) => {
      const newSelectedWords = { ...selectedWords };
      if (Object.prototype.hasOwnProperty.call(newSelectedWords, word)) {
        delete newSelectedWords[word];
      } else {
        if (Object.keys(newSelectedWords).length >= 3) {
          toast({
            title: "단어는 3개까지 선택 가능 합니다.",
            status: "error",
            duration: 5000,
            isClosable: true,
          });
          return;
        }
        newSelectedWords[word] = dynamicWordList[word];
      }
      setSelectedWords(newSelectedWords);
    },
    [selectedWords, dynamicWordList, toast],
  );

  const handleGetScript = useCallback(async () => {
    setScriptLoading(true);
    try {
      const updatedDialogParams: InputDialogData = {
        line_count: Object.keys(selectedWords).length + 2,
        word_pairs: selectedWords,
      };

      const apiResult = await FetchGpt.getScript(updatedDialogParams);

      toast({
        title: "대화문 생성이 완료되었습니다",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      setScriptResult(JSON.stringify(apiResult));
    } catch (error) {
      toast({
        title: "대화문 생성에 실패했습니다",
        description: `Error: ${error.message || error}`,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setScriptLoading(false);
    }
  }, [selectedWords, toast]);

  return (
    <Box background="white" boxShadow="md" p={6} rounded="md" flexGrow={1} width="100%">
      <Flex direction="column" align="center" justify="flex-start" minHeight="100vh">
        <Text fontSize="xl" fontWeight="bold" mb={4}>
          최근 학습한 단어로 문장을 생성해 보세요!
        </Text>
        <Text fontSize="sm" mb={4}>
          단어 학습 후 결과 페이지에서도 이용하실 수 있습니다!
        </Text>
        <Box maxW="sm" p={4} borderWidth={1} borderRadius="lg">
          <Box width="100%">
            {isWordsLoading ? (
              <Spinner /> // 로딩 중일 때 Spinner 표시
            ) : Object.keys(dynamicWordList).length === 0 ? (
              <div style={{ fontSize: "24px", fontWeight: "bold" }}>최근 학습한 단어 없음</div>
            ) : (
              <>
                {Object.keys(dynamicWordList).map((word) => (
                  <Tag
                    key={word}
                    size="md"
                    variant={Object.keys(selectedWords).includes(word) ? "solid" : "outline"}
                    colorScheme="teal"
                    m={1}
                    onClick={() => handleTagClick(word)}
                  >
                    {word}
                  </Tag>
                ))}
                <Box width="100%">
                  <Box textAlign="center">
                    <Tooltip
                      label={
                        Object.keys(selectedWords).length > 0 ? "" : "단어를 먼저 선택해주세요!"
                      }
                      placement="top"
                    >
                      <Button
                        mt={4}
                        onClick={handleGetScript}
                        isDisabled={
                          isGrammarLoading ||
                          isScriptLoading ||
                          Object.keys(selectedWords).length === 0
                        }
                      >
                        {isScriptLoading ? <Spinner /> : "대화 생성하기"}
                      </Button>
                    </Tooltip>
                  </Box>
                </Box>
              </>
            )}
          </Box>
          <Box mt={4} maxW="sm">
            <Text mt={8} mb={4} fontSize="sm" color="gray.500">
              생성된 문장의 단어를 클릭하거나 마우스 커서를 올리면 뜻을 확인 할 수 있습니다
            </Text>
            {scriptResult ? (
              <>
                <ScriptDialog
                  dialogResult={JSON.parse(scriptResult)}
                  isGrammarLoading={isGrammarLoading}
                  setGrammarLoading={setGrammarLoading}
                  isScriptLoading={isScriptLoading}
                  selectedWords={selectedWords}
                />
                <Box textAlign="center">
                  <Button colorScheme="teal"
                          mt={4}
                          onClick={() => window.location.reload()}>
                    처음으로 돌아가기
                  </Button>
                </Box>
              </>
            ) : null}
          </Box>
        </Box>
      </Flex>
    </Box>
  );
};

export default GptDialogPage;
