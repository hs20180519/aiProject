import React, { ChangeEvent, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AxiosError } from "axios";
import * as Api from "../../apis/api";
import useDebounced from "../../hooks/useDebounce";
import validateEmail from "../../libs/validateEmail";

import {
  VStack,
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  HStack,
  InputRightElement,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
  Link as ChakraLink,
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { Link as ReactRouterLink } from "react-router-dom";
import KakaoLoginButton from "../Login/KakaoLoginButton";

type NewUserInfoType = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  verificationCode: string;
};

let timer: NodeJS.Timer;

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);

  const [newUserInfo, setNewUserInfo] = useState<NewUserInfoType>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    verificationCode: "", // 이메일 인증 코드 필드 추가
  });

  const { name, email, password, confirmPassword, verificationCode } = newUserInfo;

  const navigate = useNavigate();
  const [isEmailAvailable, setIsEmailAvailable] = useState<boolean>(false);
  const [hasEmailCode, setHasEmailCode] = useState<string | null>(null);
  const debounceFetchTerm = useDebounced(email, 500);

  const getEmailStatus = () => {
    if (isEmailAvailable) {
      return "이 이메일은 사용 가능합니다.";
    }
    if (isEmailAvailable === false) {
      return "이미 사용 중인 이메일 주소입니다.";
    }
    if (isEmailAvailable === undefined) {
      return "이메일 가용성 확인 중 오류가 발생했습니다.";
    }
    return ""; // 반환값이 없을 경우 빈 문자열 반환
  };

  // 1. 중복 검사를 진행한다.
  const fetchEmailCheck = async () => {
    try {
      const res = await Api.get(`/auth/check?email=${email}`);
      console.log("----이메일 유효성 검사 --");
      console.log(res);
      if (res.status === 403) {
        setIsEmailAvailable(false);
      } else {
        setIsEmailAvailable(true);
      }

      const { isAvailable } = res.data;
    } catch (e) {
      console.log("----error----");
      console.log(e);
    }

    // try {
    //   const response = await Api.get(`/api/auth/check?email=${email}`);
    //   console.log("----이메일 유효성 검사 --");
    //   console.log(response);
    //   const { isAvailable } = response.data;
    //   if (isAvailable) {
    //     setIsEmailAvailable(true);
    //     // 이메일이 사용 가능하면 이메일 인증 요청
    //     await emailVerification(email);
    //   } else {
    //     console.log("---중복 처리---");
    //   }
    // } catch (err) {
    //   console.error("이메일 중복 확인 중 오류 발생:", err);
    // }
  };

  // 2. 이메일 인증 요청을 보낸다.
  const fetchEmailVerification = async () => {
    try {
      await Api.post(`/auth/register`, { email });
    } catch (err) {
      console.error("이메일 인증 중 오류 발생:", err);
    }
  };

  // 3. 인증번호 인증을 진행한다.
  const fetchEmailCode = async (verificationCode: string) => {
    try {
      await Api.post(`/auth/verify`, { verificationCode });
      setHasEmailCode("이메일 인증이 완료되었습니다.");
    } catch (err) {
      console.error("이메일 인증 코드 확인 중 오류 발생:", err);
      setHasEmailCode("이메일 인증 코드 확인 중 오류가 발생했습니다.");
    }
  };

  // 4. 회원가입을 진행한다.
  const fetchRegister = async () => {
    try {
      // 이메일 인증 코드 확인
      const validateCode = await fetchEmailCode(verificationCode);
      // 회원가입 요청
      await Api.post("/auth/signup", {
        name,
        email,
        password,
      });
      navigate("/login");
    } catch (err) {
      if (err.isAxiosError) {
        const axiosError = err as AxiosError;
        console.error(axiosError.response?.data);
      } else {
        console.error(err);
      }
    }
  };

  const isNameValid = name.length >= 2;
  const isEmailValid = validateEmail(email);
  const isPasswordValid = password.length >= 4;
  const isPasswordSame = password === confirmPassword;
  const isVerificationCodeValid = verificationCode.length > 0;

  const isFormValid =
    isNameValid && isEmailValid && isPasswordValid && isPasswordSame && isVerificationCodeValid;

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewUserInfo({
      ...newUserInfo,
      [name]: value,
    });
  };

  const navigateToIntroPage = () => {
    navigate("/");
  };

  useEffect(() => {
    if (debounceFetchTerm) {
      fetchEmailCheck();
    }
  }, [debounceFetchTerm]);

  return (
    <Flex
      minH={"100vh"}
      align={"center"}
      justify={"center"}
      bg={useColorModeValue("gray.100", "gray.800")}
    >
      <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
        <Stack align={"center"}>
          <Heading fontSize={"4xl"} textAlign={"center"}>
            Sign up
          </Heading>
          <Text fontSize={"lg"} color={"gray.600"}>
            to enjoy all of our cool features ✌️
          </Text>
        </Stack>
        <Box rounded={"lg"} bg={useColorModeValue("white", "gray.700")} boxShadow={"lg"} p={8}>
          <Stack spacing={4}>
            <Box w="360px">
              <FormControl id="firstName" isRequired>
                <FormLabel>이름</FormLabel>
                <Input type="text" name="name" value={name} onChange={handleChange} />
              </FormControl>
            </Box>
            <Box w="360px">
              <FormControl id="email" isRequired>
                <FormLabel>이메일</FormLabel>
                {email.length !== 0 && (
                  <Text
                    position="absolute"
                    right="24px"
                    bottom="10px"
                    fontSize="xs"
                    color={isEmailAvailable ? "green.500" : "tomato"}
                  >
                    {isEmailAvailable ? "사용 가능" : "이미 사용"}
                  </Text>
                )}

                <Input name="email" type="email" value={email} onChange={handleChange} />
              </FormControl>
            </Box>
            <Box w="360px">
              <FormControl id="code" isRequired>
                <FormLabel>인증번호</FormLabel>
                <Input
                  type="text"
                  name="verificationCode"
                  value={verificationCode}
                  onChange={handleChange}
                />
                <Box position="absolute" right="0" top="45%">
                  <Button
                    fontSize={"sm"}
                    border={"none"}
                    bg={"none"}
                    onClick={fetchEmailVerification}
                  >
                    인증번호 전송
                  </Button>
                </Box>
              </FormControl>
            </Box>

            <Box w="360px">
              <FormControl id="password" isRequired>
                <FormLabel>비밀번호</FormLabel>
                <InputGroup>
                  <Input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    onChange={handleChange}
                    value={password}
                  />
                  <InputRightElement h={"full"}>
                    <Button variant={"ghost"} onClick={() => setShowPassword((prev) => !prev)}>
                      {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                    </Button>
                  </InputRightElement>
                </InputGroup>
              </FormControl>
            </Box>
            <Box w="360px">
              <FormControl id="password_confirm" isRequired>
                <FormLabel>비밀번호 확인</FormLabel>
                <InputGroup>
                  <Input
                    value={confirmPassword}
                    name="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    onChange={handleChange}
                  />
                  <InputRightElement h={"full"}>
                    <Button variant={"ghost"} onClick={() => setShowPassword((prev) => !prev)}>
                      {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                    </Button>
                  </InputRightElement>
                </InputGroup>
              </FormControl>
            </Box>

            <Stack spacing={10} pt={2}>
              <Button
                loadingText="Submitting"
                size="lg"
                bg={"blue.400"}
                color={"white"}
                _hover={{
                  bg: "blue.500",
                }}
              >
                회원가입
              </Button>
            </Stack>
            <Stack pt={6}>
              <Text align={"center"}>
                Already a user?{" "}
                <ChakraLink as={ReactRouterLink} color={"blue.400"} to="/login">
                  Login
                </ChakraLink>
              </Text>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
};

export default SignUp;
