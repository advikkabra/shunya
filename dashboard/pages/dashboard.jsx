import { Flex, Stack, Text, Center, Image, Container, Heading, HStack, VStack, Button, SimpleGrid, CircularProgress, CircularProgressLabel } from '@chakra-ui/react'
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
import { Progress } from "../components/Progress"
import { Graph } from "../components/Graph"
import { MemberTable } from "../components/MemberTable"
export default function() { 

  const router = useRouter()
  const auth = getAuth();
  const db = getFirestore();
  const [email, setEmail] = useState("");

  const [emissions, setEmissions] = useState([200, 200, 250, 250, 120]);
  const [months, setMonths] = useState(["July 2022", "June 2022", "May 2022", "April 2022", "March 2022"]);
  const [transactions, setTransactions] = useState([{date: 24, month: 6, year: 2022, emissions: 194, description: "Lenovo laptop 8GB"}])

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
            <SimpleGrid columns={{ base: 1, md: 2 }} gap="6">
              <Card minH="xs" p="8">
                <SimpleGrid columns="2" gap="6">
                  
                  <SimpleGrid columns="2" gap="6">
                    <Progress value={emissions[4]} target={300} month={months[4]}/>
                    <Progress value={emissions[3]} target={300} month={months[3]}/>
                    <Progress value={emissions[2]} target={300} month={months[2]}/>
                    <Progress value={emissions[1]} target={300} month={months[1]}/>
                    
                  </SimpleGrid >
                  <Progress value={emissions[0]} target={300} month={months[0]} isBig/>
                </SimpleGrid >
              </Card>
              <Card minH="xs" p="5">
               <Heading size="sm"  mb="4">
                  Emissions over time
                </Heading>
                <Graph emissions={emissions.reverse()} months={months.reverse()}/>
              </Card>
              
            </SimpleGrid>
          </Stack>
          <Card minH="sm" p="5"><MemberTable data={transactions}/></Card>
        </Stack>
     
  </Flex>
)}