import React, { useState, useCallback } from "react";
import {
  Box,
  Button,
  Flex,
  Text,
  Spinner,
  VStack,
  ListItem,
  Spacer,
  UnorderedList,
  Tag,
} from "@chakra-ui/react";
import {
  DialogEntry,
  DialogResponse,
  GrammarExplanation,
  GrammarResponse,
  InputDialogData,
  InputGrammarData,
} from "../apis/new_gpt_schema";
import { FetchGpt } from "../apis/new_gpt";

interface TestGptWordPageProps {}

const simpleHash = (str: string): string => {
  let hash = 0;
  for (let i = 0; i < str.length; i += 1) {
    const char = str.charCodeAt(i);
    // eslint-disable-next-line no-bitwise
    hash = (hash << 5) - hash + char;
  }
  return hash.toString();
};

const TestGptWordPage: React.FC<TestGptWordPageProps> = () => {
  const [selectedWords, setSelectedWords] = useState([]);
  const [isScriptLoading, setScriptLoading] = useState(false);
  const [scriptResult, setScriptResult] = useState(null);
  const [isGrammarLoading, setGrammarLoading] = useState(false);
  const [grammarResult, setGrammarResult] = useState({});
  const [loadingEntryKey, setLoadingEntryKey] = useState(null);

  const wordList = {
    aboard: "배로",
    abort: "중단하다",
    about: "-에 대하여",
    apple: "사과",
    banana: "바나나",
  };

  const handleTagClick = (word: string) => {
    if (selectedWords.length >= 3 && !selectedWords.includes(word)) {
      return;
    }
    const isSelected = selectedWords.includes(word);
    const newSelectedWords = isSelected
      ? selectedWords.filter((w) => w !== word)
      : [...selectedWords, word];
    setSelectedWords(newSelectedWords);
  };

  const handleGetGrammar = useCallback(async (dialog: DialogEntry[], dialogKey: string) => {
    console.log("handleGetGrammar 실행, 현재 dialog:", dialog, "현재 dialogKey:", dialogKey);
    setLoadingEntryKey(dialogKey);
    setGrammarLoading(true);
    try {
      const updatedGrammarParams: InputGrammarData = {
        dialog,
      };
      const apiResult = await FetchGpt.getGrammar(updatedGrammarParams);
      console.log("API 호출 결과:", apiResult);
      setGrammarResult((prevResults) => ({
        ...prevResults,
        [dialogKey]: JSON.stringify(apiResult),
      }));
    } catch (error) {
      console.log("API 호출 실패:", error);
      setGrammarResult((prevResults) => ({
        ...prevResults,
        [dialogKey]: `Failed to fetch grammar: ${error}`,
      }));
    } finally {
      setLoadingEntryKey(null);
      setGrammarLoading(false);
    }
  }, []);

  const handleGetScript = useCallback(async () => {
    console.log("handleGetScript 실행, 현재 selectedWords:", selectedWords);
    setScriptLoading(true);
    try {
      const updatedDialogParams: InputDialogData = {
        line_count: selectedWords.length + 2,
        word_pairs: selectedWords.reduce((obj, word) => {
          return { ...obj, [word]: wordList[word] };
        }, {}),
      };

      console.log("API 호출 전, updatedDialogParams:", updatedDialogParams);
      const apiResult = await FetchGpt.getScript(updatedDialogParams);
      console.log("API 호출 결과:", apiResult);
      setScriptResult(JSON.stringify(apiResult));
    } catch (error) {
      console.log("API 호출 실패:", error);
      setScriptResult(`Failed to fetch script: ${error}`);
    } finally {
      setScriptLoading(false);
    }
  }, [selectedWords, wordList]);

  function renderGrammarDialog(grammarResult: GrammarResponse) {
    if (!grammarResult || !grammarResult.grammar) {
      return null;
    }

    return (
      <VStack align="start" spacing={4}>
        {grammarResult.grammar.map((entry: GrammarExplanation, index: number) => {
          const messageKey = `${simpleHash(entry.message)}_${index}`;
          return (
            <Box key={messageKey} p={2} borderWidth={1} borderRadius="md">
              <Text fontWeight="bold">{entry.message}</Text>
              <UnorderedList mt={2} fontStyle="italic">
                {entry.explain.split("\n").map((point: string, pointIndex: number) => {
                  const pointKey = `${simpleHash(point)}_${pointIndex}`;
                  const cleanedPoint = point.replace(/^\d+\.\s*/, ""); // Remove numbering like "1. "
                  return <ListItem key={pointKey}>{cleanedPoint}</ListItem>;
                })}
              </UnorderedList>
            </Box>
          );
        })}
      </VStack>
    );
  }

  function renderScriptDialog(dialogResult: DialogResponse) {
    if (!dialogResult || !dialogResult.dialog) {
      return null;
    }

    return (
      <VStack align="start" spacing={4}>
        {dialogResult.dialog.map((entry: DialogEntry, index: number) => {
          const dialogKey = `${simpleHash(`${entry.speaker}_${entry.message}`)}_${index}`;
          const currentGrammarResult = grammarResult[dialogKey]
            ? JSON.parse(grammarResult[dialogKey])
            : null;

          return (
            <Box key={dialogKey} p={2} borderWidth={1} borderRadius="md">
              <Text fontWeight="bold">{entry.speaker}:</Text>
              <Text>{entry.message}</Text>
              <Button
                mt={2}
                onClick={() => {
                  if (!isGrammarLoading) {
                    handleGetGrammar([entry], dialogKey);
                  }
                }}
                isDisabled={isGrammarLoading || isScriptLoading}
              >
                {loadingEntryKey === dialogKey && isGrammarLoading ? <Spinner /> : "문법 설명"}
              </Button>

              <Spacer mt={6} />
              {currentGrammarResult && renderGrammarDialog(currentGrammarResult)}
            </Box>
          );
        })}
      </VStack>
    );
  }

  return (
    <Flex direction="column" align="center" justify="flex-start" height="100vh">
      <Box maxW="sm" p={4} borderWidth={1} borderRadius="lg">
        <Box>
          {Object.keys(wordList).map((word) => (
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
          {scriptResult ? renderScriptDialog(JSON.parse(scriptResult)) : null}
        </Box>
      </Box>
    </Flex>
  );
};

export default TestGptWordPage;
