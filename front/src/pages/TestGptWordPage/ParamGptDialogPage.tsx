import React, { useEffect, useState, useCallback } from "react";
import { Text, Box, Flex, Spinner, useToast } from "@chakra-ui/react";
import { FetchGpt } from "../../apis/gpt";
import ScriptDialog from "./components/ScriptDialog";
import { useLocation } from "react-router-dom";

const ParamGptDialogPage = () => {
  const location = useLocation();
  const receivedWords = location.state?.receivedWords || {};

  const [isScriptLoading, setScriptLoading] = useState(false);
  const [scriptResult, setScriptResult] = useState(null);
  const [isGrammarLoading, setGrammarLoading] = useState(false);

  const toast = useToast();

  const handleGetScript = useCallback(async () => {
    setScriptLoading(true);
    try {
      const updatedDialogParams = {
        line_count: Object.keys(receivedWords).length + 2,
        word_pairs: receivedWords,
      };

      const apiResult = await FetchGpt.getScript(updatedDialogParams);

      toast({
        title: "Script fetch successful.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      setScriptResult(JSON.stringify(apiResult));
    } catch (error) {
      toast({
        title: "Script fetch failed.",
        description: `Error: ${error.message || error}`,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setScriptLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    if (receivedWords) {
      handleGetScript();
    }
  }, [receivedWords, handleGetScript]);

  return (
    <Flex direction="column" align="center" justify="flex-start" minHeight="100vh">
      <Box background="white" boxShadow="md" p={6} rounded="md" flexGrow={1} width="100%">
        {isScriptLoading ? (
          <Flex justifyContent="center" alignItems="center" height="100%" direction="column">
            <Text fontSize="xl" fontWeight="bold" mb={4}>
              대화문을 생성 중입니다
            </Text>
            <Spinner />
          </Flex>
        ) : null}
        {scriptResult ? (
          <Box m="8">
            <ScriptDialog
              dialogResult={JSON.parse(scriptResult)}
              isGrammarLoading={isGrammarLoading}
              setGrammarLoading={setGrammarLoading}
              isScriptLoading={isScriptLoading}
              selectedWords={receivedWords}
            />
          </Box>
        ) : null}
      </Box>
    </Flex>
  );
};

export default ParamGptDialogPage;
