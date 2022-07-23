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
} from "@chakra-ui/react";

function App() {
  return (
    <Container>
      <Center pt={2}>
        <Heading fontSize="4xl">Shunya</Heading>
      </Center>
      <VStack pt={2}>
        <CircularProgress value={40} size="100px" color="teal.500">
          <CircularProgressLabel>
            <Text fontWeight="bold" fontSize={"xl"}>
              40
            </Text>
          </CircularProgressLabel>
        </CircularProgress>
        <Heading fontSize="xl">Amount of CO2 emitted this month</Heading>
      </VStack>
      <Center pt={2}>
        <VStack>
          <Text as="em"> Visit your dashboard to see more </Text>
          <Link href="http://localhost:3000/" isExternal>
            Dashboard
          </Link>
        </VStack>
      </Center>
    </Container>
  );
}

export default App;
