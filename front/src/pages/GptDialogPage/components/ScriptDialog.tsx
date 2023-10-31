import React, { useState, useCallback } from "react";
import {
  Tooltip,
  Button,
  Text,
  Box,
  Spacer,
  Spinner,
  VStack,
  useToast,
  Flex,
} from "@chakra-ui/react";
import { DialogEntry } from "../../../apis/gpt_interface";
import { simpleHash } from "../utils/gptUtils";
import { FetchGpt } from "../../../apis/gpt";
import GrammarDialog from "./GrammarDialog";
import { translateText } from "../../../apis/translate";

const highlightWords = (text: string, selectedWords: Record<string, string>) => {
  const selectedWordKeys = Object.keys(selectedWords);
  return text
    .split(" ")
    .map((word, index) => {
      const foundKey = selectedWordKeys.find((key) => word.includes(key));
      if (foundKey) {
        const meaning = selectedWords[foundKey];
        return (
          <Tooltip label={meaning} key={index}>
            <Text
              as="span"
              fontStyle="italic"
              fontWeight="600"
              style={{
                backgroundImage: "linear-gradient(transparent 60%, #F8CD07 40%)",
                backgroundRepeat: "no-repeat",
                backgroundSize: "100% 15px",
                backgroundPosition: "0 100%",
              }}
            >
              {word}
            </Text>
          </Tooltip>
        );
      }
      return word;
    })
    .reduce((acc, curr, index) => {
      if (index !== 0) {
        acc.push(" ");
      }
      acc.push(curr);
      return acc;
    }, [] as React.ReactNode[]);
};

const ScriptDialog = ({
  dialogResult,
  isGrammarLoading,
  setGrammarLoading,
  isScriptLoading,
  selectedWords,
}) => {
  const [grammarResult, setGrammarResult] = useState<Record<string, string>>({});
  const [loadingEntryKey, setLoadingEntryKey] = useState<string | null>(null);
  const toast = useToast();

  const [loadingTranslationKey, setLoadingTranslationKey] = useState<string | null>(null);
  const [translationResult, setTranslationResult] = useState<Record<string, string>>({});

  const handleGetGrammar = useCallback(
    async (dialog: DialogEntry[], dialogKey: string) => {
      setLoadingEntryKey(dialogKey);
      setGrammarLoading(true);
      try {
        const apiResult = await FetchGpt.getGrammar({ dialog });
        setGrammarResult((prev) => ({ ...prev, [dialogKey]: JSON.stringify(apiResult) }));
        toast({
          title: "Grammar fetch successful.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } catch (error) {
        toast({
          title: "Grammar fetch failed.",
          description: `Error: ${error.message || error}`,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setLoadingEntryKey(null);
        setGrammarLoading(false);
      }
    },
    [setGrammarLoading, toast],
  );

  if (!dialogResult?.dialog) {
    return null;
  }

  const handleGetTranslation = useCallback(
    async (dialog: DialogEntry, dialogKey: string) => {
      setLoadingTranslationKey(dialogKey);
      try {
        const apiResult = await translateText(dialog.message);
        setTranslationResult((prev) => ({ ...prev, [dialogKey]: apiResult.translatedText }));
        toast({
          title: "Translation successful.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } catch (error) {
        toast({
          title: "Translation failed.",
          description: `Error: ${error.message || error}`,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setLoadingTranslationKey(null);
      }
    },
    [toast],
  );

  return (
    <VStack align="start" spacing={4}>
      {dialogResult.dialog.map((entry: DialogEntry, index: number) => {
        const dialogKey = `${simpleHash(`${entry.speaker}_${entry.message}`)}_${index}`;
        const currentGrammarResult = grammarResult[dialogKey]
          ? JSON.parse(grammarResult[dialogKey])
          : null;
        return (
          <Box
            key={dialogKey}
            p={2}
            borderWidth={1}
            borderRadius="md"
            bg={entry.speaker === "Person A" ? "gray.50" : ""}
            width="100%"
          >
            <Flex direction="column" justifyContent="space-between">
              <Text fontWeight="bold">{entry.speaker}:</Text>
              <Text>{highlightWords(entry.message, selectedWords)}</Text>
              <Text
                fontSize="xs"
                color="gray.800"
                fontStyle="italic"
                borderLeft="4px solid"
                borderColor="gray.300"
                pl={2}
                ml={0}
              >
                {translationResult[dialogKey] ?? translationResult[dialogKey]}
              </Text>
            </Flex>
            <Box textAlign="right">
              <Button
                mt={2}
                onClick={() => !isGrammarLoading && handleGetGrammar([entry], dialogKey)}
                isDisabled={isGrammarLoading || isScriptLoading}
                borderWidth={2}
                borderColor="white"
              >
                {loadingEntryKey === dialogKey && isGrammarLoading ? <Spinner /> : "문법 설명"}
              </Button>
              <Button
                mt={2}
                onClick={() => !isGrammarLoading && handleGetTranslation(entry, dialogKey)}
                isDisabled={isGrammarLoading || isScriptLoading}
                borderWidth={2}
                borderColor="white"
              >
                {loadingTranslationKey === dialogKey && isGrammarLoading ? <Spinner /> : "번역"}
              </Button>
            </Box>
            <Spacer mt={6} />
            {currentGrammarResult && <GrammarDialog grammar={currentGrammarResult.grammar} />}
          </Box>
        );
      })}
    </VStack>
  );
};

export default ScriptDialog;
