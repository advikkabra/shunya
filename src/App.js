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
  Button
} from "@chakra-ui/react";
import React, {useState, useEffect} from 'react';
import { GoogleIcon } from './ProviderIcons'

function App() {

  
  const [loggedIn, setLoggedIn] = useState(false);
  return (
    <>
     {loggedIn ? (
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
          <Button >Visit dashboard</Button>
          <Button colorScheme="teal" variant='outline'>Log out</Button>

        </HStack>
      </Center>
      </>
      ): (
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
        <HStack mb="5">
          
          <Button size="sm" colorScheme="gray" variant="outline" w="full" leftIcon={<GoogleIcon boxSize="5" />} iconSpacing="3">
          Continue with Google
        </Button>

        </HStack>
      </Center>
      </>
      )}
      
    </>
  );
}

export default App;
