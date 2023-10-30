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
} from '@chakra-ui/react';

export default function SocialProfileWithImage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [userImage, setUserImage] = useState('');
  const navigate = useNavigate();
  const [csatProgress, setCsatProgress] = useState(0); // CSAT 진행률 상태
  const [toeflProgress, setToeflProgress] = useState(0); // TOEFL 진행률 상태
  const [toeicProgress, setToeicProgress] = useState(0); // TOEIC 진행률 상태
  const [overallPercentage, setOverallPercentage] = useState('0.00');

  useEffect(() => {
    // 사용자의 이름과 이메일 가져오기 (일반 로그인 사용자)
    Api.get('/user')
      .then((response) => {
        const userData = response.data;
        if (userData.email === null) {
          //
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
        setToeflProgress(toefl);
        setToeicProgress(toeic);
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
        })
        .catch((error) => {
          console.error('이미지 업로드 오류:', error);
        });
    } else {
      console.log('No file selected.');
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
            <Text color={'gray.500'}>{email}</Text>
          </Stack>
          <Stack mb={3} align={'center'}>
            <Button
              as="label"
              htmlFor="profileImageInput"
              mt={3}
              bg="green.400"
              color="white"
              _hover={{ bg: 'darkblue' }}
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
              <Text>{parseFloat(overallPercentage).toFixed(2)}%</Text>
              <Text fontSize={'xl'} color={'gray.500'}>
                <Text>CSAT 진행도</Text>
                <Progress value={csatProgress} colorScheme="green" mb={2} />
                <Text>TOEFL 진행도</Text>
                <Progress value={toeflProgress} colorScheme="green" mb={2} />
                <Text>TOEIC 진행도</Text>
                <Progress value={toeicProgress} colorScheme="green" mb={2} />
              </Text>
            </Stack>
          </Stack>
          <Stack align={'Center'}>
          <Button
            onClick={navigateToMainPage}
            mt={3}
            bg={useColorModeValue('green.400', 'green.400')}
            color={'white'}
            rounded={'md'}
            _hover={{
              transform: 'translateY(-2px)',
              boxShadow: 'lg',
            }}
          >
            학습 하러가기
          </Button>
          </Stack>
        </Box>
      </Box>
    </Center>
  );
}
