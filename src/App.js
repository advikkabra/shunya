import "./App.css";
import {
  Container,
  CircularProgress,
  CircularProgressLabel,
  HStack,
  Text,
  Heading,
  Center,
  Link,
  VStack,
  Image,
  Button,
  Input,
  Box,
  Spinner
} from "@chakra-ui/react";
import React, {useState, useEffect} from 'react';
import { GoogleIcon } from './ProviderIcons'
import { getAuth, setPersistence, signInWithEmailAndPassword, browserLocalPersistence } from "firebase/auth";

function App() {

  const auth = getAuth();
  const [loading, setLoading] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  useEffect(() => {
    auth.onAuthStateChanged(function(user) {
      if (user) {
        setLoggedIn(true);
      }
      setLoading(false);
     
    });
  }, [])

  const onLogin = () => {
    setLoginLoading(true);
    
    setErrorMessage("");
    setPersistence(auth, browserLocalPersistence).then(() => {
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // Signed in
          setLoggedIn(true);
          setLoginLoading(false);
          setEmail("");
          setPassword("");
          setErrorMessage("");
          const user = userCredential.user;

          // ...
        })
        .catch((error) => {
          setLoginLoading(false);
          const errorCode = error.code;
          setErrorMessage(error.message);
          // ..
        });
    })
    
  }

  const onLogout = () => {
    auth.signOut()
      .then(() => {
        setLoggedIn(false);
      })
      .catch((error) => {
        // An error happened
        console.log(error.message)
      });
  }

  return (
    <>

     {loading && (
       <Center pt={2} pb="4" mt="4">

        <Spinner
          thickness='3px'
          speed='0.65s'
          emptyColor='gray.200'
          color='teal.500'
          
        />
      </Center>
      )}
     {!loading && loggedIn && (
      <>
      <Center pt={2} pb="4" mt="4">
        <Image h='8' objectFit='cover' src='./logo.png' alt='Shunya' />
      </Center>
      <VStack pt={2} mb="4">
        <CircularProgress style={{cursor: "default"}} value={40} size="150px" color="teal.500">
          <CircularProgressLabel>
            <Text fontWeight="bold" fontSize={"4xl"}>
              40
            </Text>
            <Text fontWeight="medium" fontSize="sm">
              CO₂e
            </Text>
          </CircularProgressLabel>
        </CircularProgress>
        <Heading fontSize="xl">July 2022</Heading>
      </VStack>
      <Center pt={2} >
        <HStack mb="5">
          <Button size="sm">Visit dashboard</Button>
          <Button size="sm" colorScheme="teal" variant='outline' onClick={onLogout}>Log out</Button>

        </HStack>
      </Center>
      </>
      )}
     {!loading && !loggedIn && (
      <>
      <Center pt={2} pb="4" mt="4">
        <Image h='8' objectFit='cover' src='./logo.png' alt='Shunya' />
      </Center>
      <VStack pt="4" mb="4">
        
            <Text fontWeight="bold" fontSize={"xl"}>
              Log in to your account
            </Text>

            
      </VStack>
      <Center pt={2} >
        <VStack mb="5">
          
        <Input placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)} size="sm"/>
        <Input placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)} type="password" size="sm"/>
        <Button size="sm" loadingText="Loading" isLoading={loginLoading} onClick={onLogin} w="full" >
          Log in
        </Button>
        <Box pt="2">
          <Text fontSize="sm">
            Don't have an account? {' '}
            <Link color='teal.500' href='#'>
              Sign up
            </Link>{' '}
            
          </Text>
        </Box>
        <Box pt="2">
          <Text fontSize="sm" color="red.500">
            {errorMessage}
            
          </Text>
        </Box>
        

        </VStack>
      </Center>
      </>
      )}
      
    </>
  );
}

export default App;
