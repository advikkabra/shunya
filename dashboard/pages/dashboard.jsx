import {
  Flex,
  Stack,
  Text,
  Center,
  Image,
  Container,
  Heading,
  HStack,
  VStack,
  Button,
  SimpleGrid,
  CircularProgress,
  CircularProgressLabel,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import Raect, { useState, useEffect, useDisclosure } from "react";
import { FaTree, FaCamera, FaPowerOff } from "react-icons/fa";
import { useRouter } from "next/router";
import { getAuth } from "firebase/auth";
import {
  getFirestore,
  collection,
  addDoc,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { Card } from "../components/Card";
import { NavButton } from "../components/NavButton";
import { Progress } from "../components/Progress";
import { Graph } from "../components/Graph";
import { MemberTable } from "../components/MemberTable";
export default function () {
  const router = useRouter();
  const auth = getAuth();
  const db = getFirestore();
  const [email, setEmail] = useState("");

  const [emissions, setEmissions] = useState([0, 0, 0, 0, 0]);
  const [months, setMonths] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const [loadingDonation, setLoadingDonation] = useState(false);

  useEffect(() => {
    auth.onAuthStateChanged(function (user) {
      if (!user) {
        router.push("/login");
      } else {
        fetch("http://localhost:5000/api/getdashboard", {
          method: "POST",
          body: JSON.stringify({ email: user.email }),
          headers: { "Content-Type": "application/json" },
        })
          .then((response) => response.json())
          .then((res) => {
            setEmissions(res.emissions);
            setMonths(res.months);
            setTransactions(res.transactions);
          });
        setEmail(user.email);
      }
    });
  }, []);

  const onLogout = () => {
    auth
      .signOut()
      .then(() => {
        router.push("/login");
      })
      .catch((error) => {
        // An error happened
        console.log(error.message);
      });
  };

  const onDonate = () => {
    setLoadingDonation(true);
    fetch("http://localhost:5000/api/offset", {
          method: "POST",
          body: JSON.stringify({ email: email, month: (new Date()).getMonth(), year: (new Date()).getFullYear() }),
          headers: { "Content-Type": "application/json" },
        })
          .then((response) => response.json())
          .then((res) => {
            setLoadingDonation(false);
            setIsOpen(false);
            fetch("http://localhost:5000/api/getdashboard", {
              method: "POST",
              body: JSON.stringify({ email: email }),
              headers: { "Content-Type": "application/json" },
            })
              .then((response) => response.json())
              .then((res) => {
                setEmissions(res.emissions);
                setMonths(res.months);
                setTransactions(res.transactions);
              });
          }).catch(e => setLoadingDonation(false));
  }
  return (
    <>
    <Modal size="xl" isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Offset carbon emissions for {months[0]}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text size="lg">Emissions for the month</Text>
            <Heading size="md" mt="2">{Math.round(emissions[0])} kg of CO₂e</Heading>

            <Text size="lg" mt="4">Number of trees to plant 🌲</Text>
            <Heading size="md" mt="2">{Math.round(emissions[0]/100)} trees</Heading>

            <Text size="lg" mt="4">Donation Amount</Text>
            <Heading size="md" mt="2">Rs. {200 * Math.round(emissions[0]/100)}</Heading>

            <Button onClick={onDonate} colorScheme="teal" mt="5" mb="3" w="full" isLoading={loadingDonation} loadingText='Loading'>Donate</Button>
          </ModalBody>

          
        </ModalContent>
      </Modal>
    <Flex as="section" minH="100vh" bg="gray.50">
      <Flex
        flex="1"
        w="full"
        bg="teal.500"
        maxW={{
          base: "full",
          sm: "xs",
        }}
        py={{
          base: "6",
          sm: "8",
        }}
        px={{
          base: "4",
          sm: "6",
        }}
      >
        <Stack justify="space-between" spacing="1" width="full">
          <Stack spacing="8" shouldWrapChildren>
            <Image src="/logo2.png" w="60%" />

            <Stack spacing="1">
              <NavButton onClick={() => setIsOpen(true)} label="Offset carbon" icon={FaTree} />

              <NavButton
                onClick={onLogout}
                label="Log out"
                icon={FaPowerOff}
                aria-current="page"
              />
            </Stack>
          </Stack>
        </Stack>
      </Flex>

      <Stack w="full" py="8" px="8" spacing={{ base: "8", lg: "6" }}>
        <Stack
          spacing="4"
          direction={{ base: "column", lg: "row" }}
          justify="space-between"
          align={{ base: "start", lg: "center" }}
        >
          <Stack spacing="1">
            <Heading size="lg" fontWeight="bold">
              Carbon Emission Dashboard
            </Heading>
            <Text color="muted">
              View the important metrics that define your impact on the planet.
            </Text>
          </Stack>
        </Stack>
        <Stack spacing={{ base: "5", lg: "6" }}>
          <SimpleGrid columns={{ base: 1, md: 2 }} gap="6">
            <Card minH="xs" p="8">
              <SimpleGrid columns="2" gap="6">
                <SimpleGrid columns="2" gap="6">
                  <Progress
                    value={Math.round(emissions[4])}
                    target={300}
                    month={months[4]}
                  />
                  <Progress
                    value={Math.round(emissions[3])}
                    target={300}
                    month={months[3]}
                  />
                  <Progress
                    value={Math.round(emissions[2])}
                    target={300}
                    month={months[2]}
                  />
                  <Progress
                    value={Math.round(emissions[1])}
                    target={300}
                    month={months[1]}
                  />
                </SimpleGrid>
                <Progress
                  value={emissions[0]}
                  target={300}
                  month={months[0]}
                  isBig
                />
              </SimpleGrid>
            </Card>
            <Card minH="xs" p="6">
              <Heading size="sm" mb="4">
                Emissions over time
              </Heading>
              <Graph
                emissions={emissions}
                months={months}
              />
            </Card>
          </SimpleGrid>
        </Stack>
        <Card minH="sm" p="6">
        <Heading size="md" mb="6">
                Transaction history
              </Heading>
          <MemberTable data={transactions} />
        </Card>
      </Stack>
    </Flex>
    </>
  );
}

