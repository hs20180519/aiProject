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
import { cleanKey, createRegex, simpleHash } from "../utils/gptUtils";
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
      if (openTooltip === index) {
        setOpenTooltip(null); // 이미 열린 툴팁을 닫음
      } else {
        setOpenTooltip(index); // 새로운 툴팁을 염
      }
    }
  };

  const highlightWords = (
    text: string,
    selectedWords: Record<string, string>,
    dialogKey: string,
  ) => {
    // 모든 키를 순회하면서 괄호와 공백을 제거한 키를 생성한 다음 원래의 뜻과 매핑하여 저장
    const cleanSelectedWords = Object.fromEntries(
      Object.entries(selectedWords).map(([key, value]) => [cleanKey(key), value]),
    );

    // 긴 단어가 짧은 단어에 포함되어 있을 경우, 긴 단어를 먼저 찾아 정확하게 하이라이트하기 위해 정렬
    const sortedKeys = Object.keys(cleanSelectedWords).sort((a, b) => b.length - a.length);

    // 정규 표현식 객체 생성 단계
    const regex = createRegex(sortedKeys);

    let match;
    let lastIndex = 0;
    const result = [];

    // 정규 표현식과 일치하는 단어를 찾는 반복문
    // regex.exec(text)는 text에서 regex와 일치하는 첫 번째 문자열을 찾는다.
    while ((match = regex.exec(text)) !== null) {
      // 찾은 단어가 문장 중간에 있다면 그 앞에 있는 문자열을 result에 추가
      if (lastIndex < match.index) {
        result.push(text.slice(lastIndex, match.index));
      }

      // 고유 인덱스를 생성 (다이얼로그 키와 마지막 인덱스를 결합)
      const uniqueIndex = `${dialogKey}_${regex.lastIndex}`;

      // 찾은 단어를 소문자로 변환 후 뜻을 가져온다
      const meaning = cleanSelectedWords[match[0].toLowerCase()];

      // 하이라이트가 포함된 툴팁 컴포넌트를 result에 추가
      result.push(
        <TooltipWord
          word={match[0]}
          meaning={meaning}
          index={uniqueIndex}
          isMobile={isMobile}
          openTooltip={openTooltip}
          handleTooltipClick={handleTooltipClick}
          tooltipRef={tooltipRef}
        />,
      );

      // 마지막 인덱스를 업데이트
      lastIndex = regex.lastIndex;
    }

    // 마지막으로 남은 문자열을 result에 추가
    if (lastIndex < text.length) {
      result.push(text.slice(lastIndex));
    }

    return result;
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
        "문법 설명이 생성되었습니다",
        "문법 설명이 실패했습니다",
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
        "번역이 완료되었습니다",
        "번역이 실패했습니다",
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
              <Text>{highlightWords(entry.message, selectedWords, dialogKey)}</Text>
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
