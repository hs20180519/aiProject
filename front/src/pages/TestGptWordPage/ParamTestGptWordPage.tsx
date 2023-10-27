import React, { useEffect, useState, useCallback } from "react";
import { Box, Flex, Spinner, useToast } from "@chakra-ui/react";
import { FetchGpt } from "../../apis/gpt";
import ScriptDialog from "./components/ScriptDialog";
import { useLocation } from "react-router-dom";

const ParamTestGptWordPage = () => {
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
    <Flex height="100vh" align="center" justify="center">
      <Box background="white" boxShadow="md" p={6} rounded="md">
        {isScriptLoading ? <Spinner /> : null}
        {scriptResult ? (
          <ScriptDialog
            dialogResult={JSON.parse(scriptResult)}
            isGrammarLoading={isGrammarLoading}
            setGrammarLoading={setGrammarLoading}
            isScriptLoading={isScriptLoading}
          />
        ) : null}
      </Box>
    </Flex>
  );
};

export default ParamTestGptWordPage;
