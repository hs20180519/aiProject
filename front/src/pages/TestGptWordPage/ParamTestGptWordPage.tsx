import React, { useEffect, useState, useCallback } from "react";
import { Button, Spinner, useToast } from "@chakra-ui/react";
import { FetchGpt } from "../../apis/gpt";
import ScriptDialog from "./components/ScriptDialog";

const ParamTestGptWordPage = ({ receivedWords }) => {
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
  }, [receivedWords, toast]);

  useEffect(() => {
    if (receivedWords) {
      handleGetScript();
    }
  }, [receivedWords, handleGetScript]);

  return (
    <div>
      <Button isDisabled={isScriptLoading}>
        {isScriptLoading ? <Spinner /> : "대화 생성하기"}
      </Button>
      {scriptResult ? (
        <ScriptDialog
          dialogResult={JSON.parse(scriptResult)}
          isGrammarLoading={isGrammarLoading}
          setGrammarLoading={setGrammarLoading}
          isScriptLoading={isScriptLoading}
        />
      ) : null}
    </div>
  );
};

export default ParamTestGptWordPage;
