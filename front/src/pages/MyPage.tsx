import React, { useState, useEffect, useRef } from 'react';
import Chart from '@toast-ui/react-chart';
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
} from '@chakra-ui/react';

export default function ProfileWithImage() {

  type UserInfoType = {
    name: string;
    email: string;
    profileImage: string;
  }

  const [user, setUser] = useState<UserInfoType>({
    name: '',
    email: '',
    profileImage: '',
  });
  const [progress, setProgress] = useState(0);
  const chartRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    // 사용자 정보 가져오기
    Api.get('/user')
      .then((response) => {
        setUser(response.data);
      })
      .catch((error) => {
        console.error('사용자 정보 가져오기 오류:', error);
      });

    // 학습 진행률 가져오기
    Api.get('/progress')
      .then((progressResponse) => {
        const progressData = progressResponse.data;
        setProgress(progressData.progress);
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
          setUser({ ...user, profileImage: response.data });
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

  const pieChartData = {
    categories: ['CSAT', 'TOEIC', 'IELTS', 'TOEFL'],
    series: [
      {
        data: [25, 35, 20, 20], // 학습 진행률 데이터
      },
    ],
  };

  return (
    <Center py={6}>
      <Box
        maxW={'270px'}
        w={'full'}
        bg={useColorModeValue('white', 'gray.800')}
        boxShadow={'2xl'}
        rounded={'md'}
        overflow={'hidden'}
      >
        <Flex justify={'center'} mt={5}>
          <Avatar
            size={'xl'}
            src={user.profileImage}
            key={user.profileImage}
            css={{
              border: '2px solid white',
            }}
          />
        </Flex>
        <Box p={6}>
          <Stack spacing={0} align={'center'} mb={5}>
            <Heading fontSize={'2xl'} fontWeight={500} fontFamily={'body'}>
              {user.name}
            </Heading>
            <Text color={'gray.500'}>{user.email}</Text>
          </Stack>
          <Stack mb={5}>
            <input type='file' name='profileImage' onChange={handleImageUpload} />
          </Stack>
          <Stack direction={'row'} justify={'center'} spacing={6}>
            <Stack spacing={0} align={'center'}>
              <Text fontWeight={600}>학습 진행</Text>
              <Text fontSize={'sm'} color={'gray.500'}>
                {progress}% 완료
              </Text>
              <Chart
                ref={chartRef}
                data={pieChartData}
                options={{ chart: { width: 300, height: 300 } }}
                type='pie'
              />
            </Stack>
          </Stack>
          <Button
            onClick={navigateToMainPage}
            w={'full'}
            mt={8}
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
        </Box>
      </Box>
    </Center>
  );
}
