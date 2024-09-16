import {
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
    useToast,
} from '@chakra-ui/react';
import Link from "next/link";
import { useEffect, useState } from 'react'
import styles from "../styles/navbar.module.css";
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons'
import { PiEyeDuotone, PiEyeSlashDuotone } from 'react-icons/pi';
import { useRouter } from 'next/router';
import { signUp, useAuth } from '../lib/hooks';
import Head from 'next/head';
import Loader from '../components/Loader';

export default function SignupCard() {
    const toast = useToast();
    const router = useRouter();
    const isLoggedIn = useAuth();
    const [isLoading, setIsLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const validateForm = ({ firstName, lastName, email, password }) => {
        const errors = [];
        if (!firstName) {
            errors.push('First name is required');
        } else if (firstName.trim().length === 0) {
            errors.push('First name cannot be empty');
        } else if (firstName.includes(' ')) {
            errors.push('First name cannot contain spaces');
        }
        if (!lastName) {
            errors.push('Last name is required');
        } else if (lastName.trim().length === 0) {
            errors.push('Last name cannot be empty');
        } else if (lastName.includes(' ')) {
            errors.push('Last name cannot contain spaces');
        }
        if (!email) {
            errors.push('Email is required');
        } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
            errors.push('Invalid email address');
        }
        if (!password) {
            errors.push('Password is required');
        } else if (password.length < 6) {
            errors.push('Password must be at least 6 characters long');
        } else if (!/(?=.*[a-z])/.test(password)) {
            errors.push('Password must contain at least one lowercase letter');
        } else if (!/(?=.*[A-Z])/.test(password)) {
            errors.push('Password must contain at least one uppercase letter');
        } else if (!/(?=.*\d)/.test(password)) {
            errors.push('Password must contain at least one number');
        } else if (!/(?=.*[!@#$%^&*()_+=-{};:"<>,./?])/.test(password)) {
            errors.push('Password must contain at least one special character');
        }


        return errors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errors = validateForm({ firstName, lastName, email, password });
        if (errors.length === 0) {
            setIsLoading(true);
            await signUp(firstName, lastName, email, password).then((data) => {
                toast({
                    title: "SignUp Successful",
                    description: "Login to continue",
                    status: "success",
                    duration: 2500,
                    isClosable: true,
                    position: "top",
                });
                router.push('/login');
            }).catch((err) => {
                // console.log(err);

                toast({
                    title: err?.error,
                    description: "",
                    status: "error",
                    duration: 2500,
                    isClosable: true,
                    position: "top",
                });
                if (err.status === 409) {
                    router.push('/login');
                }
            }).finally(() => {
                setIsLoading(false);
            });
        } else {
            toast({
                title: 'Invalid inputs!',
                description: errors.join(', '),
                status: "error",
                duration: 2500,
                isClosable: true,
                position: "top",
            });
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
            {isLoading && <Loader show='Signing-up' />}
            <Head>
                <title>Hetan's Guide | SignUp </title>
                <meta
                    name="description"
                    content="A comprehensive list of topics in Competitive Programming. Signup and create your account to explore all cool features."
                />
            </Head>
            <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
                <Stack align={'center'}>
                    <Heading fontSize={'4xl'} textAlign={'center'}>
                        Sign up to create account
                    </Heading>
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
                        <HStack>
                            <Box>
                                <FormControl id="firstName" isRequired>
                                    <FormLabel>First Name</FormLabel>
                                    <Input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder='First Name' />
                                </FormControl>
                            </Box>
                            <Box>
                                <FormControl id="lastName" isRequired>
                                    <FormLabel>Last Name</FormLabel>
                                    <Input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder='Last Name' />
                                </FormControl>
                            </Box>
                        </HStack>
                        <FormControl id="email" isRequired>
                            <FormLabel>Email address</FormLabel>
                            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder='Email Address' />
                        </FormControl>
                        <FormControl id="password" isRequired>
                            <FormLabel>Password</FormLabel>
                            <InputGroup>
                                <Input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder='Aa@123' />
                                <InputRightElement h={'full'}>
                                    <Button
                                        size={'sm'}
                                        variant={'ghost'}
                                        onClick={() => setShowPassword((showPassword) => !showPassword)}>
                                        {showPassword ? <PiEyeDuotone title='Hide' size={21} /> : <PiEyeSlashDuotone title='Show' size={21} />}
                                    </Button>
                                </InputRightElement>
                            </InputGroup>
                        </FormControl>
                        <Stack spacing={10} pt={2}>
                            <Button
                                onClick={handleSubmit}
                                loadingText="Submitting"
                                size="lg"
                                bg={'blue.400'}
                                color={'white'}
                                _hover={{
                                    bg: 'blue.500',
                                }}>
                                Sign up
                            </Button>
                        </Stack>
                        <Stack>
                            <Text align={'center'}>
                                Already a user? <Link className={styles.navLink} href={"/login"} style={{ color: '#4299e1', textShadow: 'none', fontSize: '1rem', fontWeight: 'bold' }}>Login</Link>
                            </Text>
                        </Stack>
                    </Stack>
                </Box>
            </Stack>
        </Flex>
    )
}