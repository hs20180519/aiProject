import React, { useState, useEffect } from 'react';
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
} from '@chakra-ui/react';

export default function SocialProfileWithImage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [userImage, setUserImage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // API 호출: 사용자 정보 가져오기
    Api.get('/user')
      .then((response) => {

        // API 응답에서 이름과 이메일 추출
        const userData = response.data;
        console.log(userData);

        setName(userData.name);
        setEmail(userData.email);
        setUserImage(userData.profileImage);
      })
      .catch((error) => {
        console.error('API 호출 오류:', error);
      });
  }, []);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    console.log("Selected file:", file); // 선택한 파일 로깅

    if (file) {
      // 이미지 업로드 API 호출
      const formData = new FormData();
      formData.append('profileImage', file);

      Api.sendImage('post', '/upload/profile-image', formData)
      .then((response) => {
        console.log("Server Response:", response); // 서버 응답 로깅
        // 이미지 업로드 성공 시 이미지 URL을 업데이트
        setUserImage(response.data);
      })
      .catch((error) => {
        console.error('이미지 업로드 오류:', error);
      });
    } else {
      console.log("No file selected."); // 파일이 선택되지 않았을 경우 로깅
    }
  };

  const navigateToMainPage = () => {
    navigate("/main");
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
            src={userImage}
            key={userImage}
            css={{
              border: '2px solid white',
            }}
          />
        </Flex>
        <Box p={6}>
          <Stack spacing={0} align={'center'} mb={5}>
            <Heading fontSize={'2xl'} fontWeight={500} fontFamily={'body'}>
              {name}
            </Heading>
            <Text color={'gray.500'}>{email}</Text>
          </Stack>
          <Stack mb={5}>
            <input type="file" name="profileImage" onChange={handleImageUpload} />
          </Stack>
          <Stack direction={'row'} justify={'center'} spacing={6}>
            <Stack spacing={0} align={'center'}>
              <Text fontWeight={600}>학습 진행</Text>
              <Text fontSize={'sm'} color={'gray.500'}>
                진행 정도?? 여긴 뭐로 넣어줄까?
              </Text>
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
