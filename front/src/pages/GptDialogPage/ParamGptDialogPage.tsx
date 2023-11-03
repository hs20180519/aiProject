import React, { useEffect, useState, useCallback } from "react";
import { Button, Text, Box, Flex, Spinner, useToast, Tag, Center } from "@chakra-ui/react";
import { FetchGpt } from "../../apis/gpt";
import ScriptDialog from "./components/ScriptDialog";
import { useLocation } from "react-router-dom";
import { Link as RouterLink } from "react-router-dom";

const ParamGptDialogPage = () => {
  const location = useLocation();
  const receivedWords = location.state?.receivedWords || {};

  const [isScriptLoading, setScriptLoading] = useState(false);
  const [scriptResult, setScriptResult] = useState(null);
  const [isGrammarLoading, setGrammarLoading] = useState(false);

  const toast = useToast();

  const [isScriptError, setScriptError] = useState(false);

  const handleGetScript = useCallback(async () => {
    setScriptError(false);
    setScriptLoading(true);
    try {
      const updatedDialogParams = {
        line_count: Object.keys(receivedWords).length + 2,
        word_pairs: receivedWords,
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
      setScriptError(true);

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
  }, [toast]);

  useEffect(() => {
    if (receivedWords) {
      handleGetScript();
    }
  }, [receivedWords, handleGetScript]);

  return (
    <Flex direction="column" align="center" justify="flex-start" minHeight="100vh">
      <Box background="white" boxShadow="md" p={6} rounded="md" flexGrow={1} width="100%">
        <Center>
          <Box m="4">
            <Text fontSize="xl" fontWeight="bold">
              대화를 생성할 단어 리스트
            </Text>
            <Text mt="2">
              {Object.keys(receivedWords).map((word, index) => (
                <Tag key={index} size="md" variant="solid" colorScheme="teal" m={1}>
                  {word}
                </Tag>
              ))}
            </Text>
            <Text mt={4} fontSize="sm" color="gray.500">
              생성된 문장의 단어를 클릭하거나 마우스 커서를 올리면 뜻을 확인 할 수 있습니다
            </Text>
          </Box>
        </Center>

        {isScriptLoading ? (
          <Flex justifyContent="center" alignItems="center" height="100%" direction="column">
            <Text fontSize="l" fontWeight="bold" mb={4} mt={10}>
              대화문을 생성 중입니다
            </Text>
            <Spinner />
          </Flex>
        ) : null}
        {isScriptError ? (
          <Box textAlign="center" mt={4}>
            <Button colorScheme="red" onClick={handleGetScript}>
              요청 다시보내기
            </Button>
          </Box>
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
            <Box textAlign="center">
              <Button as={RouterLink} to="/" colorScheme="teal" m={2}>
                처음으로 돌아가기
              </Button>
            </Box>
          </Box>
        ) : null}
      </Box>
    </Flex>
  );
};

export default ParamGptDialogPage;
