import React, { useState, useCallback, useEffect } from "react";
import {
  Button,
  Text,
  Box,
  Spacer,
  Spinner,
  VStack,
  useToast,
  Flex,
  useMediaQuery,
} from "@chakra-ui/react";
import { DialogEntry, GrammarResponse } from "../../../apis/gpt_interface";
import { simpleHash } from "../utils/gptUtils";
import { FetchGpt } from "../../../apis/gpt";
import GrammarDialog from "./GrammarDialog";
import { translateText } from "../../../apis/translate";
import TooltipWord from "./TooltipWord";

const ScriptDialog = ({
  dialogResult,
  isGrammarLoading,
  setGrammarLoading,
  isScriptLoading,
  selectedWords,
}) => {
  const [grammarResult, setGrammarResult] = useState<Record<string, GrammarResponse>>({});
  const [loadingEntryKey, setLoadingEntryKey] = useState<string | null>(null);
  const toast = useToast();

  const [loadingTranslationKey, setLoadingTranslationKey] = useState<string | null>(null);
  const [translationResult, setTranslationResult] = useState<
    Record<
      string,
      {
        translatedText: string;
      }
    >
  >({});

  const [isMobile] = useMediaQuery("(max-width: 600px)");
  const [openTooltip, setOpenTooltip] = useState<number | null>(null);
  const tooltipRef = React.useRef(null);

  useEffect(() => {
    if (isMobile && openTooltip !== null) {
      const handleClickOutside = (event: Event) => {
        if (tooltipRef.current && !tooltipRef.current.contains(event.target)) {
          setOpenTooltip(null);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [isMobile, openTooltip]);

  const handleTooltipClick = (index: number) => {
    if (isMobile) {
      setOpenTooltip(index);
    }
  };

  const highlightWords = (text: string, selectedWords: Record<string, string>) => {
    const selectedWordKeys = Object.keys(selectedWords);
    return text
      .split(" ")
      .map((word, index) => {
        const foundKey = selectedWordKeys.find((key) => word.includes(key));
        if (foundKey) {
          const meaning = selectedWords[foundKey];
          return (
            <TooltipWord
              word={word}
              meaning={meaning}
              index={index}
              isMobile={isMobile}
              openTooltip={openTooltip}
              handleTooltipClick={handleTooltipClick}
              tooltipRef={tooltipRef}
            />
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

  if (!dialogResult?.dialog) {
    return null;
  }

  const handleApiFetch = useCallback(
    async function handleApiFetchFunction<T>(
      apiCall: () => Promise<T>,
      setResult: React.Dispatch<React.SetStateAction<Record<string, T>>>,
      dialogKey: string,
      setLoadingKey: React.Dispatch<React.SetStateAction<string | null>>,
      successMessage: string,
      errorMessage: string,
    ) {
      setLoadingKey(dialogKey);
      setGrammarLoading(true);
      try {
        const apiResult = await apiCall();
        setResult((prev) => ({ ...prev, [dialogKey]: apiResult }));
        toast({
          title: successMessage,
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } catch (error) {
        toast({
          title: errorMessage,
          description: `Something went wrong. Please try again.`,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setLoadingKey(null);
        setGrammarLoading(false);
      }
    },
    [toast, setGrammarLoading],
  );

  const handleGetGrammar = useCallback(
    (dialog: DialogEntry[], dialogKey: string) => {
      handleApiFetch(
        () => FetchGpt.getGrammar({ dialog }),
        setGrammarResult,
        dialogKey,
        setLoadingEntryKey,
        "Grammar fetch successful.",
        "Grammar fetch failed.",
      );
    },
    [handleApiFetch],
  );

  const handleGetTranslation = useCallback(
    (dialog: DialogEntry, dialogKey: string) => {
      handleApiFetch(
        () => translateText(dialog.message),
        setTranslationResult,
        dialogKey,
        setLoadingTranslationKey,
        "Translation successful.",
        "Translation failed.",
      );
    },
    [handleApiFetch],
  );

  return (
    <VStack align="start" spacing={4}>
      {dialogResult.dialog.map((entry: DialogEntry, index: number) => {
        const dialogKey = `${simpleHash(`${entry.speaker}_${entry.message}`)}_${index}`;
        const currentGrammarResult = grammarResult[dialogKey]
          ? grammarResult[dialogKey].grammar
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
                {translationResult[dialogKey]?.translatedText ??
                  translationResult[dialogKey]?.translatedText}
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
            {currentGrammarResult && <GrammarDialog grammar={currentGrammarResult} />}
          </Box>
        );
      })}
    </VStack>
  );
};

export default ScriptDialog;
