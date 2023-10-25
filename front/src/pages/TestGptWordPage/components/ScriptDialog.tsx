import React, { useState, useCallback } from "react";
import { Button, Text, Box, Spacer, Spinner, VStack, useToast } from "@chakra-ui/react";
import { DialogEntry, DialogResponse, InputGrammarData } from "../../../apis/gpt_interface";
import { simpleHash } from "../utils/gptUtils";
import { FetchGpt } from "../../../apis/gpt";
import GrammarDialog from "./GrammarDialog";

const ScriptDialog = ({
  dialogResult,
  isGrammarLoading,
  setGrammarLoading,
  isScriptLoading,
}: {
  dialogResult: DialogResponse;
  isGrammarLoading: boolean;
  setGrammarLoading: React.Dispatch<React.SetStateAction<boolean>>;
  isScriptLoading: boolean;
}) => {
  const [grammarResult, setGrammarResult] = useState({});
  const [loadingEntryKey, setLoadingEntryKey] = useState(null);
  const toast = useToast();

  const handleGetGrammar = useCallback(
    async (dialog: DialogEntry[], dialogKey: string) => {
      console.log("handleGetGrammar 실행, 현재 dialog:", dialog, "현재 dialogKey:", dialogKey);
      setLoadingEntryKey(dialogKey);
      setGrammarLoading(true);
      try {
        const updatedGrammarParams: InputGrammarData = {
          dialog,
        };
        const apiResult = await FetchGpt.getGrammar(updatedGrammarParams);

        toast({
          title: "Grammar fetch successful.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });

        console.log("API 호출 결과:", apiResult);
        setGrammarResult((prevResults) => ({
          ...prevResults,
          [dialogKey]: JSON.stringify(apiResult),
        }));
      } catch (error) {
        toast({
          title: "Grammar fetch failed.",
          description: `Error: ${error.message || error}`,
          status: "error",
          duration: 5000,
          isClosable: true,
        });

        console.log("API 호출 실패:", error);
        setGrammarResult((prevResults) => ({
          ...prevResults,
          [dialogKey]: `Failed to fetch grammar: ${error.message || error}`,
        }));
      } finally {
        setLoadingEntryKey(null);
        setGrammarLoading(false);
      }
    },
    [toast, setGrammarLoading],
  );

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
            {currentGrammarResult && <GrammarDialog grammar={currentGrammarResult.grammar} />}
          </Box>
        );
      })}
    </VStack>
  );
};

export default ScriptDialog;
