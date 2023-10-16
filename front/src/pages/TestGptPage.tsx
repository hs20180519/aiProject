import React, { useState, useCallback } from "react";
import { Box, Button, Flex, Text, Textarea, Spinner, VStack, Input } from "@chakra-ui/react";
import { ListItem, OrderedList } from "@chakra-ui/react";
import {
  DialogEntry,
  DialogResponse,
  GrammarExplanation,
  GrammarResponse,
  InputDialogData,
  InputGrammarData,
} from "../apis/new_gpt_schema"; // Adjust the import path
import { FetchGpt } from "../apis/new_gpt"; // Adjust the import path

interface TestGptPageProps {}

const TestGptPage: React.FC<TestGptPageProps> = () => {
  const [isGrammarLoading, setGrammarLoading] = useState(false);
  const [isScriptLoading, setScriptLoading] = useState(false);
  const [grammarResult, setGrammarResult] = useState<string | null>(null);
  const [scriptResult, setScriptResult] = useState<string | null>(null);

  const [lineCount, setLineCount] = useState<number>(7);
  const [wordPairs, setWordPairs] = useState<string>(
    JSON.stringify(
      {
        aboard: "배로",
        abort: "중단하다",
        about: "-에 대하여",
      },
      null,
      2,
    ),
  );

  const [dialogContent, setDialogContent] = useState<string>(
    JSON.stringify(
      [
        {
          message: "Hey, have you heard about the new cruise ship that's setting sail next month?",
          speaker: "Person A",
        },
        {
          message: "Yes, I have! I'm actually planning to go aboard it.",
          speaker: "Person B",
        },
      ],
      null,
      2,
    ),
  );

  async function handleGetGrammar() {
    setGrammarLoading(true);
    try {
      const updatedGrammarParams: InputGrammarData = {
        dialog: dialogContent ? JSON.parse(dialogContent) : [],
      };
      const apiResult = await FetchGpt.getGrammar(updatedGrammarParams);
      setGrammarResult(JSON.stringify(apiResult));
    } catch (error) {
      setGrammarResult(`Failed to fetch grammar: ${error}`);
    } finally {
      setGrammarLoading(false);
    }
  }

  async function handleGetScript() {
    setScriptLoading(true);
    try {
      const updatedDialogParams: InputDialogData = {
        line_count: lineCount,
        word_pairs: JSON.parse(wordPairs),
      };
      const apiResult = await FetchGpt.getScript(updatedDialogParams);
      setScriptResult(JSON.stringify(apiResult));
    } catch (error) {
      setScriptResult(`Failed to fetch script: ${error}`);
    } finally {
      setScriptLoading(false);
    }
  }

  const handleGetGrammarCallback = useCallback(() => {
    handleGetGrammar(); // Your original handleGetGrammar function
  }, []); // Add dependencies if there are any

  const handleGetScriptCallback = useCallback(() => {
    handleGetScript(); // Your original handleGetScript function
  }, []); // Add dependencies if there are any

  function renderGrammarDialog(grammarResult: GrammarResponse) {
    if (!grammarResult || !grammarResult.grammar) {
      return null;
    }

    return (
      <VStack align="start" spacing={4}>
        {grammarResult.grammar.map((entry: GrammarExplanation) => {
          const messageKey = entry.message.substring(0, 10); // Create a simple unique key from the message
          return (
            <Box key={messageKey} p={2} borderWidth={1} borderRadius="md">
              <Text fontWeight="bold">{`Message:`}</Text>
              <Text>{entry.message}</Text>
              <OrderedList mt={2} fontStyle="italic">
                {entry.explain.split("\n").map((point: string) => {
                  const pointKey = point.substring(0, 10); // Create a simple unique key from the point
                  const cleanedPoint = point.replace(/^\d+\.\s*/, ""); // Remove numbering like "1. "
                  return <ListItem key={pointKey}>{cleanedPoint}</ListItem>;
                })}
              </OrderedList>
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
        {dialogResult.dialog.map((entry: DialogEntry) => {
          const dialogKey = `${entry.speaker}_${entry.message.substring(0, 10)}`; // Create a unique key
          return (
            <Box key={dialogKey} p={2} borderWidth={1} borderRadius="md">
              <Text fontWeight="bold">{entry.speaker}:</Text>
              <Text>{entry.message}</Text>
            </Box>
          );
        })}
      </VStack>
    );
  }

  return (
    <Flex direction={"column"} align={"center"} justify={"flex-start"} height={"100vh"}>
      <Box maxW={"sm"} p={4} borderWidth={1} borderRadius={"lg"}>
        <Textarea
          mt={4}
          value={dialogContent}
          onChange={(e) => setDialogContent(e.target.value)}
          placeholder='[{"message": "Message here", "speaker": "Speaker name"}]'
        />
        <Button mt={4} onClick={handleGetGrammarCallback}>
          Test Grammar
        </Button>
        {/* Grammar Result */}
        <Box mt={4} maxW={"sm"}>
          {isGrammarLoading ? <Spinner /> : renderGrammarDialog(JSON.parse(grammarResult))}
        </Box>

        <Input
          type="number"
          value={lineCount}
          onChange={(e) => setLineCount(Number(e.target.value))}
          placeholder="Line Count"
        />
        <Textarea mt={4} value={wordPairs} onChange={(e) => setWordPairs(e.target.value)} />
        <Button mt={4} onClick={handleGetScriptCallback}>
          Test Script
        </Button>
        {/* Script Result */}
        <Box mt={4} maxW={"sm"}>
          {isScriptLoading ? <Spinner /> : renderScriptDialog(JSON.parse(scriptResult))}
        </Box>
      </Box>
    </Flex>
  );
};

export default TestGptPage;
