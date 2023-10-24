import { Box, InputProps, Text } from "@chakra-ui/react";
import styled from "@emotion/styled";
import Input from "../InputFeild";

interface CustomeWordCard extends InputProps {
  label: string;
}

/*
const handleApi = async({
  preloadCallback,
  fetchApi,
  onSecced,
  onError,
  onFinally,
}:{
    preloadCallback: () => void,
    fetchApi:()=> Promise<any>,
    onSuccess: (data:any)=> void,
    onError:(err:any)=>void,
    onFinally:()=>void
}); */

export default function AddCustomeWordCard({ label, ...props }: CustomeWordCard) {
  return (
    <Box>
      <Text>{label}</Text>
      <Input {...props} />
    </Box>
  );
}
