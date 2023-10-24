import { Input, InputProps, Text } from "@chakra-ui/react";
import styled from "@emotion/styled";

interface GrammarInput extends InputProps {
  label: string;
}

const GrammarInput = ({ label, ...props }: GrammarInput) => {
  return (
    <StyledGrammerWrapper>
      <Text>{label}</Text>
      <Input {...props} />
    </StyledGrammerWrapper>
  );
};

const StyledGrammerWrapper = styled.div`
  min-width: 474px;
`;
export default GrammarInput;
