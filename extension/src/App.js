/*global chrome*/

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
  Spinner,
} from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import { GoogleIcon } from "./ProviderIcons";
import {
  getAuth,
  setPersistence,
  signInWithEmailAndPassword,
  browserLocalPersistence,
} from "firebase/auth";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);
function App() {
  const auth = getAuth();
  const [loading, setLoading] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  const [target, setTarget] = useState(500);
  const [monthly, setMonthly] = useState(100);
  const [added, setAdded] = useState(0);

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  useEffect(() => {
    auth.onAuthStateChanged(function (user) {
      if (user) {
        setLoggedIn(true);
        chrome.storage.local.set({ email: user.email }, () => {});
      }
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    let em;
    chrome.storage.local.get(["emissions"], (val) => {
      if (val != null) {
        em = val.emissions;
        console.log(em);
        setAdded(em);
      }
    });
  });

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
    });
  };

  const onLogout = () => {
    auth
      .signOut()
      .then(() => {
        setLoggedIn(false);
      })
      .catch((error) => {
        // An error happened
        console.log(error.message);
      });
  };

  return (
    <>
      {loading && (
        <Center pt={2} pb="4" mt="12">
          <Spinner
            thickness="3px"
            speed="0.65s"
            emptyColor="gray.200"
            color="teal.500"
          />
        </Center>
      )}
      {!loading && loggedIn && (
        <>
          <Center pt={2} pb="4" mt="12">
            <Image h="7" objectFit="cover" src="./logo.png" alt="Shunya" />
          </Center>
          <VStack pt={2} mb="4">
            <Text
              style={{ marginTop: "45px", position: "absolute" }}
              fontWeight="bold"
              fontSize={"4xl"}
            >
              {monthly}
            </Text>
            <Text
              style={{ marginTop: "95px", position: "absolute" }}
              fontWeight="medium"
              fontSize="sm"
            >
              CO₂e
            </Text>
            <Box w="150px">
              <Doughnut
                options={{
                  responsive: true,
                  plugins: {
                    tooltip: { enabled: false },
                    legend: { display: false },
                  },
                  cutout: "80%",
                }}
                data={{
                  labels: ["", "", ""],
                  datasets: [
                    {
                      label: "# of Votes",
                      data:
                        monthly + added >= target
                          ? [0, target, 0]
                          : [monthly, added, target - monthly - added],
                      backgroundColor: ["#38B2AC", "#F56565", "#EDF2F7"],
                      hoverBackgroundColor: ["#38B2AC", "#F56565", "#EDF2F7"],
                      borderWidth: 0,
                    },
                  ],
                }}
              />
            </Box>

            <Heading fontSize="xl">
              {monthNames[new Date().getMonth()]} {new Date().getFullYear()}
            </Heading>
            {monthly + added >= target && (
              <Text color="red.500" fontWeight="medium" fontSize="lg">
                Limit exceeded
              </Text>
            )}
            {added > 0 && (
              <Text color="red.500" fontWeight="medium" fontSize="lg">
                +{added} CO₂e from purchase
              </Text>
            )}
          </VStack>
          <Center pt={2}>
            <HStack mb="16">
              <Button size="sm">Visit dashboard</Button>
              <Button
                size="sm"
                colorScheme="teal"
                variant="outline"
                onClick={onLogout}
              >
                Log out
              </Button>
            </HStack>
          </Center>
        </>
      )}
      {!loading && !loggedIn && (
        <>
          <Center pt={2} pb="4" mt="12">
            <Image h="7" objectFit="cover" src="./logo.png" alt="Shunya" />
          </Center>
          <VStack pt="4" mb="4">
            <Text fontWeight="bold" fontSize={"xl"}>
              Log in to your account
            </Text>
          </VStack>
          <Center pt={2}>
            <VStack mb="16">
              <Input
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                size="sm"
              />
              <Input
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                size="sm"
              />
              <Button
                size="sm"
                loadingText="Loading"
                isLoading={loginLoading}
                onClick={onLogin}
                w="full"
              >
                Log in
              </Button>
              <Box pt="2">
                <Text fontSize="sm">
                  Don't have an account?{" "}
                  <Link color="teal.500" href="#">
                    Sign up
                  </Link>{" "}
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
