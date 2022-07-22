import "./App.css";
import {
  Box,
  CircularProgress,
  CircularProgressLabel,
  HStack,
} from "@chakra-ui/react";

function App() {
  return (
    <Box>
      <HStack>
        <CircularProgress value={40} color="green.200">
          <CircularProgressLabel>50kg</CircularProgressLabel>
        </CircularProgress>
      </HStack>
    </Box>
  );
}

export default App;
