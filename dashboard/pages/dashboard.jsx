import { Flex, Stack, Text, Center, Image, Container, Heading, HStack, VStack, Button, SimpleGrid } from '@chakra-ui/react'
import Raect, {useState, useEffect} from 'react'
import {
  FaTree,
  FaCamera,
  FaPowerOff
} from 'react-icons/fa'
import { useRouter } from 'next/router'
import { getAuth } from "firebase/auth"
import { getFirestore, collection, addDoc, query, where, getDocs } from "firebase/firestore";
import { Card } from "../components/Card"
import { NavButton } from '../components/NavButton'

export default function() { 

  const router = useRouter()
  const auth = getAuth();
  const db = getFirestore();
  const [email, setEmail] = useState("");
  useEffect(() => {
    
    auth.onAuthStateChanged(function(user) {
      if (!user) {
        router.push("/login")
      }
      else {
        setEmail(user.email);
        
      }
    });
  }, [])

  const onLogout = () => {
    auth.signOut()
      .then(() => {
        router.push("/login");
      })
      .catch((error) => {
        // An error happened
        console.log(error.message)
      });
  }
  return (
  <Flex as="section" minH="100vh" bg="gray.50">
    <Flex
      flex="1"
      w="full"
      bg="teal.500"
      maxW={{
        base: 'full',
        sm: 'xs',
      }}
      py={{
        base: '6',
        sm: '8',
      }}
      px={{
        base: '4',
        sm: '6',
      }}
    >
      <Stack justify="space-between" spacing="1" width="full">
        <Stack spacing="8" shouldWrapChildren>
          
            <Image src="/logo2.png" w="60%"/>
          
            
          
          <Stack spacing="1" >
            <NavButton label="Offset carbon" icon={FaTree} />
            <NavButton label="Scan bill" icon={FaCamera} aria-current="page" />
            <NavButton onClick={onLogout} label="Log out" icon={FaPowerOff} aria-current="page" />
          </Stack>
        </Stack>
      </Stack>
    </Flex>
    
        <Stack w="full" py="8" px="8" spacing={{ base: '8', lg: '6' }}>
          <Stack
            spacing="4"
            direction={{ base: 'column', lg: 'row' }}
            justify="space-between"
            align={{ base: 'start', lg: 'center' }}
          >
            <Stack spacing="1">
              <Heading size="lg" fontWeight="bold">
                Carbon Emission Dashboard
              </Heading>
              <Text color="muted">View the important metrics that define your impact on the planet.</Text>
            </Stack>
            
          </Stack>
          <Stack spacing={{ base: '5', lg: '6' }}>
            <SimpleGrid columns={{ base: 1, md: 3 }} gap="6">
              <Card />
              <Card />
              <Card />
            </SimpleGrid>
          </Stack>
          <Card minH="sm" />
        </Stack>
     
  </Flex>
)}