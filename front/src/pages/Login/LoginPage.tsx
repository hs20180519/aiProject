/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { SyntheticEvent, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import * as Api from "../../apis/api";
import { DispatchContext } from "../../App";
import { UserProps } from "../../reducer";
import KakaoLoginButton from "./KakaoLoginButton";
import validateEmail from "../../libs/validateEmail";
import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  Checkbox,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
  useToast,
  Center,
} from "@chakra-ui/react";

interface LoginProps {
  email: string;
  password: string;
}
const TOAST_TIMEOUT_INTERVAL = 800;

const LoginPage = () => {
  const toast = useToast();
  const [formData, setFormData] = useState<LoginProps>({
    email: "",
    password: "",
  });

  const { email, password } = formData;

  const navigate = useNavigate();
  const dispatch = useContext(DispatchContext);
  const isEmailValid = validateEmail(email);
  const isPasswordValid = password.length >= 4;
  const isFormValid = isEmailValid && isPasswordValid;

  function userTypeGuard(arg: any): arg is UserProps {
    return "nickname" in arg && "name" in arg && "email" in arg;
  }

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();

    try {
      const res = await Api.post("/auth", {
        email,
        password,
      });
      if (res.status === 200) {
        const jwtToken = res.data.token;
        sessionStorage.setItem("userToken", jwtToken);
        const userInfo = await Api.get("/user");
        if (userTypeGuard(userInfo.data)) {
          dispatch({ type: "LOGIN_SUCCESS", payload: userInfo.data });
          toast({
            title: `로그인 성공!`,
            status: "success",
            isClosable: true,
            duration: TOAST_TIMEOUT_INTERVAL,
          });
          navigate("/main", { replace: true });
        } else {
          window.alert("유저 정보가 잘못되었습니다.");
        }
      }
    } catch (err) {
      toast({
        title: `아이디 또는 비밀번호가 틀렸습니다!`,
        status: "error",
        isClosable: true,
        duration: TOAST_TIMEOUT_INTERVAL,
      });
    }
  };

  const navigateToIntroPage = () => {
    navigate("/");
  };

  return (
    <Flex
      minH={"100vh"}
      align={"center"}
      justify={"center"}
      bg={useColorModeValue("gray.100", "gray.800")}
    >
      <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
        <Box rounded={"lg"} bg={useColorModeValue("white", "gray.700")} boxShadow={"md"} p={8}>
          <Heading fontSize={"4xl"} textAlign={"center"} color={"teal.400"}>
            워디 로그인
          </Heading>
          <Stack spacing={10} pt={5}>
            <form onSubmit={handleSubmit}>
              <FormControl id="email">
                <FormLabel color={"gray.600"}>이메일</FormLabel>
                <Input
                  type="text"
                  placeholder="이메일을 입력하세요."
                  value={email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
                {!isEmailValid && email.length > 0 && (
                  <Text color="red.500">이메일 형식이 올바르지 않습니다.</Text>
                )}
              </FormControl>
              <FormControl id="password">
                <FormLabel color={"gray.600"}>비밀번호</FormLabel>
                <Input
                  type="password"
                  placeholder="비밀번호를 입력하세요."
                  value={password}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                />
                {!isPasswordValid && password.length > 0 && (
                  <Text color="red.500">비밀번호는 4글자 이상이어야 합니다.</Text>
                )}
              </FormControl>
              <Stack spacing={10} pt={5}>
                <Button
                  type="submit"
                  colorScheme="teal"
                  variant="solid"
                  size="lg"
                  width="100%"
                  disabled={!isFormValid}
                >
                  로그인
                </Button>
              </Stack>
            </form>
          </Stack>
          <Stack spacing={10} pt={3}>
            <Text fontSize="sm" color="gray.600">
              아직 회원이 아니시라면?{" "}
              <Button as="a" href="/SignUp" colorScheme="teal" variant="link" size="xl">
                회원가입
              </Button>
              <Stack spacing={10} pt={5}>
                <KakaoLoginButton />
              </Stack>
              <Stack spacing={10} pt={3}>
                <Button onClick={navigateToIntroPage}>처음 화면으로 이동</Button>
              </Stack>
            </Text>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
};

export default LoginPage;
