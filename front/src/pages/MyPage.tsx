import React, { useState, useEffect } from 'react';
import * as Api from '../apis/api';
import { useNavigate } from 'react-router-dom';
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
} from '@chakra-ui/react';

const TOAST_TIMEOUT_INTERVAL = 800;

export default function SocialProfileWithImage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [userImage, setUserImage] = useState('');
  const navigate = useNavigate();
  const [csatProgress, setCsatProgress] = useState(0);
  const [toeflProgress, setToeflProgress] = useState(0);
  const [toeicProgress, setToeicProgress] = useState(0);
  const [toeicPercentage, setToeicPercentage] = useState('0.00');
  const [toeflPercentage, setToeflPercentage] = useState('0.00');
  const [csatPercentage, setCsatPercentage] = useState('0.00');
  const [overallPercentage, setOverallPercentage] = useState('0.00');
  const toast = useToast();
  const [isEmailPopupOpen, setEmailPopupOpen] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [isEmailVerificationComplete, setEmailVerificationComplete] = useState(false);

  useEffect(() => {
    // 사용자의 이름과 이메일 가져오기
    Api.get('/user')
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
        console.error('사용자 정보 가져오기 오류:', error);
      });

    // 학습 진행률 가져오기
    Api.get('/progress')
      .then((progressResponse) => {
        const progressData = progressResponse.data;
        setOverallPercentage(progressData.OverallPercentage || '0.00');
        const { csat, toefl, toeic } = progressData.CategoryPercentage;
        setCsatProgress(csat);
        setCsatPercentage(progressData.CategoryPercentage.csat || '0.00');
        setToeflProgress(toefl);
        setToeflPercentage(progressData.CategoryPercentage.toefl || '0.00');
        setToeicProgress(toeic);
        setToeicPercentage(progressData.CategoryPercentage.toeic || '0.00');
      })
      .catch((progressError) => {
        console.error('학습 진행 정보 가져오기 오류:', progressError);
      });
  }, []);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    console.log('Selected file:', file);

    if (file) {
      const formData = new FormData();
      formData.append('profileImage', file);

      Api.sendImage('post', '/upload/profile-image', formData)
        .then((response) => {
          console.log('Server Response:', response);
          setUserImage(response.data);
          toast({
            title: "프로필 이미지가 변경 되었습니다!",
            status: "success",
            isClosable: true,
            duration: TOAST_TIMEOUT_INTERVAL
          });
        })
        .catch((error) => {
          console.error('이미지 업로드 오류:', error);
          toast({
            title: "프로필 이미지 업로드 오류",
            status: "error",
            isClosable: true,
            duration: TOAST_TIMEOUT_INTERVAL
          });
        });
    } else {
      console.log('No file selected.');
    }
  };

  // 이메일 등록을 위한 PUT 요청
  const handleEmailVerification = async () => {
    if (!newEmail) {
      toast({
        title: "이메일을 입력해주세요.",
        status: "warning",
        isClosable: true,
        duration: TOAST_TIMEOUT_INTERVAL
      });
      return;
    }

    try {
      const emailRegistrationResponse = await Api.put('/auth', { email: newEmail });
      if (emailRegistrationResponse.status === 200) {
        toast({
          title: '이메일이 성공적으로 등록되었습니다.',
          status: "success",
          isClosable: true,
          duration: TOAST_TIMEOUT_INTERVAL
        });
        setEmailVerificationComplete(true);
      }
    } catch (error) {
      console.error('이메일 등록 오류:', error);
      toast({
        title: "이메일 등록 오류",
        status: "error",
        isClosable: true,
        duration: TOAST_TIMEOUT_INTERVAL
      });
    }
  };

  const navigateToMainPage = () => {
    navigate('/main/word');
  };

  return (
    <Center py={6}>
      <Box
        maxW={'400px'}
        w={'full'}
        bg={useColorModeValue('white', 'gray.800')}
        boxShadow={'2xl'}
        rounded={'md'}
        overflow={'hidden'}
      >
        <Flex justify={'center'} mt={5}>
          <Avatar
            size={'xl'}
            src={userImage}
            key={userImage}
            css={{
              border: '2px solid white',
            }}
          />
        </Flex>
        <Box p={6}>
          <Stack spacing={0} align={'center'} mb={0}>
            <Heading fontSize={'3xl'} fontWeight={500} fontFamily={'body'}>
              {name}
            </Heading>
            <Text color={'gray.500'}>{email || ""}</Text>
            {!email && (
              <Button onClick={() => setEmailPopupOpen(true)} colorScheme="teal" size="sm">
                이메일 등록
              </Button>
            )}
          </Stack>
          <Stack mb={3} align={'center'}>
            <Button
              as="label"
              htmlFor="profileImageInput"
              mt={3}
              bg="teal.400"
              color="white"
              _hover={{ bg: 'green.400' }}
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
              style={{ display: 'none' }}
              accept="image/*"
            />
          </Stack>
          <Stack direction={'row'} justify={'center'} spacing={10}>
            <Stack spacing={1} align={'center'}>
              <Text fontWeight={600} fontSize={'xl'}>
                학습 진행률
              </Text>
              <Text fontSize={'xl'}>전체 학습</Text>
              <Text fontSize={'xl'}>{parseFloat(overallPercentage).toFixed(2)}%</Text>
              <Text fontSize={'xl'} color={'gray.500'}>
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
          <Stack align={'Center'}>
            <Button
              onClick={navigateToMainPage}
              mt={3}
              bg={useColorModeValue('teal.400', 'teal.400')}
              color={'white'}
              rounded={'md'}
              _hover={{
                transform: 'translateY(-2px)',
                boxShadow: 'lg',
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
              <FormControl>
                <Input
                  type="email"
                  placeholder="새 이메일 주소"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                />
              </FormControl>
            )}
          </ModalBody>
          <ModalFooter>
            {!isEmailVerificationComplete ? (
              <Button colorScheme="teal" onClick={handleEmailVerification}>
                이메일 인증 요청
              </Button>
            ) : null}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Center>
  );
}
