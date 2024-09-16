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
  InputGroup,
  InputRightElement,
  useToast,
} from '@chakra-ui/react';
import Link from "next/link";
import styles from "../styles/navbar.module.css";
import { PiEyeDuotone, PiEyeSlashDuotone } from "react-icons/pi";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { logIn, useAuth } from '../lib/hooks';
import Head from 'next/head';
import Loader from '../components/Loader';

export default function SimpleCard() {
  const toast = useToast();
  const router = useRouter();
  const isLoggedIn = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const handleShowClick = () => setShowPassword(!showPassword);

  const validateForm = ({ email, password }) => {
    const errors = [];
    if (!email) {
      errors.push('Email is required');
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
      errors.push('Invalid email address');
    }
    if (!password) {
      errors.push('Password is required');
    } else if (password.length < 6) {
      errors.push('Password must be at least 6 characters');
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm({ email, password });
    if (errors.length === 0) {
      setIsLoading(true);
      await logIn(email, password).then((data) => {
        // console.log(data);
        toast({
          title: "Login Successful",
          description: "",
          status: "success",
          duration: 2500,
          isClosable: true,
          position: "top",
        })
        open('/', '_self');
      }).catch((err) => {
        // console.log(err);
        
        toast({
          title: err.response?.data?.error,
          description: err.message,
          status: "error",
          duration: 2500,
          isClosable: true,
          position: "top",
        });
        if(err.status === 404){
          router.push('/signup');
        }
      }).finally(() => {
        setIsLoading(false);
      });
    } else {
      errors.forEach((err) => {
        toast({
          title: err,
          description: "",
          status: "error",
          duration: 2500,
          isClosable: true,
          position: "top",
        });
      })
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      router.push('/');
    }
  }, [isLoggedIn]);


  return (
    <Flex
      minH={'90vh'}
      align={'center'}
      justify={'center'}
      bg={useColorModeValue('gray.50', 'gray.800')}>
      <Head>
        <title>Hetan's Guide | Login </title>
        <meta
          name="description"
          content="A comprehensive list of topics in Competitive Programming. Login to your account to experience all cool features."
        />
      </Head>
      {isLoading && <Loader show={`Logging-in `} />}
      <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
        <Stack align={'center'}>
          <Heading fontSize={'4xl'} textAlign={'center'}>Log in to your account</Heading>
          <Flex gap={2} fontSize={'lg'} color={'gray.600'}>
            to enjoy all of our cool <Text color={'blue.400'}> features</Text> ✌️
          </Flex>
        </Stack>
        <Box
          rounded={'lg'}
          bg={useColorModeValue('white', 'gray.700')}
          boxShadow={'lg'}
          p={8}>
          <Stack spacing={4}>
            <FormControl id="email" isRequired>
              <FormLabel>Email address</FormLabel>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder='Email Address' />
            </FormControl>
            <FormControl id="password" isRequired>
              <FormLabel>Password</FormLabel>
              <InputGroup>
                <Input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder='Password' />
                <InputRightElement height={'full'}>
                  <Button size={'sm'} variant={"ghost"} onClick={handleShowClick}>
                    {showPassword ? <PiEyeDuotone title='Hide' size={21} /> : <PiEyeSlashDuotone title='Show' size={21} />}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>
            <Stack spacing={10}>
              <Stack
                direction={{ base: 'column', sm: 'row' }}
                align={'start'}
                justify={'space-between'}>
                <Checkbox>Remember me</Checkbox>
                <Text color={'blue.400'}>Forgot password?</Text>
              </Stack>
              <Button
                onClick={handleSubmit}
                bg={'blue.400'}
                color={'white'}
                _hover={{
                  bg: 'blue.500',
                }}>
                Log in
              </Button>
            </Stack>
            <Stack>
              <Text align={'center'}>
                Don't have an account? <Link className={styles.navLink} style={{ color: '#4299e1', textShadow: 'none', fontSize: '1rem', fontWeight: 'bold' }} href="/signup">SignUp</Link>
              </Text>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  )
}