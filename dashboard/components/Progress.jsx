import { CircularProgress, CircularProgressLabel, Heading, Text, VStack } from '@chakra-ui/react'
import * as React from 'react'

export const Progress = (props) => (
  <VStack>
  <Heading mb="1" size={props.isBig ? "md": "xs"}>{props.month}</Heading>
  <CircularProgress color="teal.500" value={props.value} max={props.target} size="full">
    <CircularProgressLabel>
      <Heading size={props.isBig ? "3xl": "lg"}>{Math.round(props.value)}<span style={{fontSize: props.isBig ? "24pt": "14pt"}}> kg</span></Heading>
      <Text style={{fontSize: props.isBig ? "18pt": "12pt"}}>CO₂e</Text>
    </CircularProgressLabel>
  </CircularProgress>
  
  </ VStack >
)