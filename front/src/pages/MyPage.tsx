import { useState, useEffect, ChangeEvent } from "react";
import * as Api from "../apis/api";
import { useNavigate } from "react-router-dom";
import {
  Heading,
  Avatar,
  Box,
  Center,
  Flex,
  Text,
  Stack,
  Button,
  useColorModeValue,
  Progress,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Input,
  ModalFooter,
  FormControl,
  FormLabel,
} from "@chakra-ui/react";
import { AxiosError } from "axios";
import useDebounced from "../hooks/useDebounce";
import validateEmail from "../libs/validateEmail";

const TOAST_TIMEOUT_INTERVAL = 800;

type NewUserEmailInfoType = {
  newEmail: string;
  verificationCode: string;
};

export default function MyPage() {
  const toast = useToast();
  const navigate = useNavigate();

  /** 이메일 추가 모달 */
  const [isEmailPopupOpen, setEmailPopupOpen] = useState(false);

  const [newUserEmailInfo, setNewUserEmailInfo] = useState<NewUserEmailInfoType>({
    newEmail: "",
    verificationCode: "",
  });

  /** 유저 이메일 추가용 */
  const { newEmail, verificationCode } = newUserEmailInfo;

  /** 소셜 로그인 유저 이메일 추가 */
  const debounceFetchTerm = useDebounced(newEmail, 500);
  const [isEmailAvailable, setIsEmailAvailable] = useState<boolean>(false);
  const [sendEmailCodeClick, setSendEmailCodeClick] = useState(false);
  const [succededEmailCode, setSuccededEmailCode] = useState(false);

  /** 소셜 로그인 유저 이메일 추가 완료시 모달 닫기용 */
  const [isEmailVerificationComplete, setIsEmailVerificationComplete] = useState(false);

  /** 유저 내 정보 수정 및 조회 */
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [userImage, setUserImage] = useState("");

  /** 학습진행률 */
  const [csatProgress, setCsatProgress] = useState(0);
  const [toeflProgress, setToeflProgress] = useState(0);
  const [toeicProgress, setToeicProgress] = useState(0);
  const [toeicPercentage, setToeicPercentage] = useState("0.00");
  const [toeflPercentage, setToeflPercentage] = useState("0.00");
  const [csatPercentage, setCsatPercentage] = useState("0.00");
  const [overallPercentage, setOverallPercentage] = useState("0.00");

  /** 이메일 중복성 검사 info 함수 */
  const getEmailStatus = () => {
    if (isEmailAvailable) {
      return "사용 가능한 이메일";
    }
    if (isEmailAvailable === false) {
      return "사용중인 이메일";
    }
    if (isEmailAvailable === undefined) {
      return "올바르지 않은 형식";
    }
    return ""; // 반환값이 없을 경우 빈 문자열 반환
  };

  /** 이메일 중복 검사 진행 */
  const fetchEmailCheck = async () => {
    console.log("-------넘어오나~~~~---------");
    try {
      const res = await Api.get(`/auth/check?email=${newEmail}`);
      console.log("-------이메일 중복 검사중--------");
      console.log(res);
      setIsEmailAvailable(true);
      if (res.status === 403 || res.status === 409) {
        setIsEmailAvailable(false);
      } else if (res.status === 400) {
        console.log("이메일이 없습니다.");
      } else {
        setIsEmailAvailable(true);
      }
    } catch (e) {
      const customError = e as AxiosError;
      console.log(customError.message);
      setIsEmailAvailable(customError.response.status === 409 ? false : undefined);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewUserEmailInfo({ ...newUserEmailInfo, [name]: value });
  };

  /** 2. 이메일 인증 요청을 보내기 */
  const fetchSendEmailCode = async () => {
    try {
      await Api.post(`/auth/register`, { email: newEmail });
      setSendEmailCodeClick(true);

      // 인증 요청 메일 발송 성공 시 토스트 알람 표시
      toast({
        title: "이메일 인증 요청이 성공적으로 전송되었습니다.",
        status: "success",
        isClosable: true,
        duration: TOAST_TIMEOUT_INTERVAL,
      });
    } catch (e) {
      console.error("이메일 인증 중 오류 발생:", e);

      // 인증 요청 메일 발송 실패 시 토스트 알람 표시
      toast({
        title: "이메일 인증 요청을 보내는 중 오류가 발생했습니다.",
        status: "error",
        isClosable: true,
        duration: TOAST_TIMEOUT_INTERVAL,
      });
    }
  };

  /** 3. 인증번호 인증 */
  const fetchCheckEmailCode = async () => {
    try {
      const res = await Api.post(`/auth/verify`, { email: newEmail, code: verificationCode });
      if (res.status === 200) {
        setSuccededEmailCode(true);
        toast({
          title: `이메일 인증 완료!`,
          status: "success",
          isClosable: true,
          duration: TOAST_TIMEOUT_INTERVAL,
        });
      }
    } catch (e) {
      toast({
        title: `이메일 인증 실패!`,
        status: "error",
        isClosable: true,
        duration: TOAST_TIMEOUT_INTERVAL,
      });
      setSuccededEmailCode(false);
    }
  };

  /** 4. 소셜로그인 유저 이메일 등록 */
  const fetchUpdateEmail = async () => {
    if (!newEmail) {
      toast({
        title: "이메일을 입력해주세요.",
        status: "warning",
        isClosable: true,
        duration: TOAST_TIMEOUT_INTERVAL,
      });
      return;
    }
    try {
      const res = await Api.put("/auth", { email: newEmail });
      if (res.status === 200) {
        toast({
          title: "이메일이 성공적으로 등록되었습니다.",
          status: "success",
          isClosable: true,
          duration: TOAST_TIMEOUT_INTERVAL,
        });
      }
      setIsEmailVerificationComplete(true);
    } catch (error) {
      console.error("이메일 등록 오류:", error);
      toast({
        title: "이메일 등록 오류",
        status: "error",
        isClosable: true,
        duration: TOAST_TIMEOUT_INTERVAL,
      });
    }
  };

  /** 이메일 입력했나 안했나 체크 */
  const isEmailValid = validateEmail(newEmail);
  const isVerificationCodeValid = verificationCode.length > 0;

  const isFormValid = isEmailValid && isVerificationCodeValid;

  useEffect(() => {
    if (debounceFetchTerm) {
      fetchEmailCheck();
    }
  }, [debounceFetchTerm]);

  useEffect(() => {
    // 사용자의 이름과 이메일 가져오기
    Api.get("/user")
      .then((response) => {
        const userData = response.data;
        if (userData.email === null) {
          setEmailPopupOpen(true); // 이메일이 등록되어 있지 않으면 팝업 띄우기
        }
        setName(userData.name);
        setEmail(userData.email);
        setUserImage(userData.profileImage);
      })
      .catch((error) => {
        console.error("사용자 정보 가져오기 오류:", error);
      });

    // 학습 진행률 가져오기
    Api.get("/progress")
      .then((progressResponse) => {
        const progressData = progressResponse.data;
        setOverallPercentage(progressData.OverallPercentage || "0.00");
        const { csat, toefl, toeic } = progressData.CategoryPercentage;
        setCsatProgress(csat);
        setCsatPercentage(progressData.CategoryPercentage.csat || "0.00");
        setToeflProgress(toefl);
        setToeflPercentage(progressData.CategoryPercentage.toefl || "0.00");
        setToeicProgress(toeic);
        setToeicPercentage(progressData.CategoryPercentage.toeic || "0.00");
      })
      .catch((progressError) => {
        console.error("학습 진행 정보 가져오기 오류:", progressError);
      });
  }, []);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    console.log("Selected file:", file);

    if (file) {
      const formData = new FormData();
      formData.append("profileImage", file);

      Api.sendImage("post", "/upload/profile-image", formData)
        .then((response) => {
          console.log("Server Response:", response);
          setUserImage(response.data);
          toast({
            title: "프로필 이미지가 변경 되었습니다!",
            status: "success",
            isClosable: true,
            duration: TOAST_TIMEOUT_INTERVAL,
          });
        })
        .catch((error) => {
          console.error("이미지 업로드 오류:", error);
          toast({
            title: "프로필 이미지 업로드 오류",
            status: "error",
            isClosable: true,
            duration: TOAST_TIMEOUT_INTERVAL,
          });
        });
    } else {
      console.log("No file selected.");
    }
  };

  useEffect(() => {
    if (debounceFetchTerm) {
      fetchEmailCheck();
    }
  }, [debounceFetchTerm]);

  const navigateToMainPage = () => {
    navigate("/main");
  };

  return (
    <Center py={6}>
      <Box
        maxW={"400px"}
        w={"full"}
        bg={useColorModeValue("white", "gray.800")}
        boxShadow={"2xl"}
        rounded={"md"}
        overflow={"hidden"}
      >
        <Flex justify={"center"} mt={5}>
          <Avatar
            size={"xl"}
            src={userImage}
            key={userImage}
            css={{
              border: "2px solid white",
            }}
          />
        </Flex>
        <Box p={6}>
          <Stack spacing={0} align={"center"} mb={0}>
            <Heading fontSize={"3xl"} fontWeight={500} fontFamily={"body"}>
              {name}
            </Heading>
            <Text color={"gray.500"}>{email || ""}</Text>
            {!email && (
              <Button onClick={() => setEmailPopupOpen(true)} colorScheme="teal" size="sm">
                이메일 등록
              </Button>
            )}
          </Stack>
          <Stack mb={3} align={"center"}>
            <Button
              as="label"
              htmlFor="profileImageInput"
              mt={3}
              bg="teal.400"
              color="white"
              _hover={{ bg: "green.400" }}
              cursor="pointer"
              padding="10px 20px"
              rounded="md"
            >
              새 이미지 선택
            </Button>
            <input
              type="file"
              name="profileImage"
              id="profileImageInput"
              onChange={handleImageUpload}
              style={{ display: "none" }}
              accept="image/*"
            />
          </Stack>
          <Stack direction={"row"} justify={"center"} spacing={10}>
            <Stack spacing={1} align={"center"}>
              <Text fontWeight={600} fontSize={"xl"}>
                학습 진행률
              </Text>
              <Text fontSize={"xl"}>전체 학습</Text>
              <Text fontSize={"xl"}>{parseFloat(overallPercentage).toFixed(2)}%</Text>
              <Text fontSize={"xl"} color={"gray.500"}>
                <Text>CSAT 진행도</Text>
                <Progress value={csatProgress} colorScheme="teal" mb={2} />
                <Text>{csatPercentage}%</Text>
                <Text>TOEFL 진행도</Text>
                <Progress value={toeflProgress} colorScheme="teal" mb={2} />
                <Text>{toeflPercentage}%</Text>
                <Text>TOEIC 진행도</Text>
                <Progress value={toeicProgress} colorScheme="teal" mb={2} />
                <Text>{toeicPercentage}%</Text>
              </Text>
            </Stack>
          </Stack>
          <Stack align={"Center"}>
            <Button
              onClick={navigateToMainPage}
              mt={3}
              bg={useColorModeValue("teal.400", "teal.400")}
              color={"white"}
              rounded={"md"}
              _hover={{
                transform: "translateY(-2px)",
                boxShadow: "lg",
              }}
            >
              학습 하러 가기
            </Button>
          </Stack>
        </Box>
      </Box>
      <Modal isOpen={isEmailPopupOpen} onClose={() => setEmailPopupOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>이메일 변경</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {isEmailVerificationComplete ? (
              <Text color="green.500">이메일 인증이 완료되었습니다.</Text>
            ) : (
              <>
                <FormControl id="email" isRequired>
                  <FormLabel>이메일</FormLabel>
                  {newEmail.length !== 0 && (
                    <Text
                      position="absolute"
                      right="24px"
                      bottom="10px"
                      fontSize="xs"
                      color={isEmailAvailable ? "teal.500" : "tomato"}
                    >
                      {getEmailStatus()}
                    </Text>
                  )}
                  <Input name="newEmail" type="email" value={newEmail} onChange={handleChange} />
                </FormControl>

                <FormControl id="code" isRequired>
                  <FormLabel>인증번호</FormLabel>
                  <Input
                    type="text"
                    name="verificationCode"
                    value={verificationCode}
                    onChange={handleChange}
                  />
                  <Box position="absolute" right="0" top="45%">
                    {!succededEmailCode ? (
                      <Button
                        fontSize={"sm"}
                        border={"none"}
                        bg={"none"}
                        onClick={!sendEmailCodeClick ? fetchSendEmailCode : fetchCheckEmailCode}
                      >
                        {!sendEmailCodeClick ? "인증번호 전송" : "확인"}
                      </Button>
                    ) : (
                      <Button
                        fontSize={"sm"}
                        border={"none"}
                        bg={"none"}
                        disabled={true}
                        color={"teal.500"}
                      >
                        인증완료
                      </Button>
                    )}
                  </Box>
                </FormControl>
              </>
            )}
          </ModalBody>
          <ModalFooter>
            {!isEmailVerificationComplete ? (
              <Button colorScheme="teal" onClick={fetchUpdateEmail}>
                이메일 등록 요청
              </Button>
            ) : null}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Center>
  );
}
