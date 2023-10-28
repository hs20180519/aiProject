import React from "react";
import { Text, Box, ListItem, UnorderedList, VStack } from "@chakra-ui/react";
import { GrammarExplanation, GrammarResponse } from "../../../apis/gpt_interface";
import { simpleHash } from "../utils/gptUtils";

const GrammarDialog = ({ grammar }: GrammarResponse) => {
  if (!grammar) {
    return null;
  }

  console.log("Grammar type:", typeof grammar);
  console.log("Is grammar an array?", Array.isArray(grammar));

  return (
    <VStack align="start" spacing={4}>
      {grammar.map((entry: GrammarExplanation, index: number) => {
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
};

export default GrammarDialog;
