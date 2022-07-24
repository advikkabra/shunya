import {
  Avatar,
  Badge,
  Box,
  Checkbox,
  HStack,
  Icon,
  IconButton,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react'
import * as React from 'react'

import { IoArrowDown } from 'react-icons/io5'


export const MemberTable = (props) => (
  <Table {...props}>
    <Thead>
      <Tr>
        <Th>
          Date
        </Th>
        <Th>Description</Th>
        <Th>Emissions</Th>
        
      </Tr>
    </Thead>
    <Tbody>
      {props.data.map((member) => (
        <Tr >
          <Td>
            <Badge size="sm" colorScheme={'blue'}>{member.date}/{member.month + 1}/{member.year}</Badge>
          </Td>
          <Td>
            <Text color="muted">{member.description}</Text>
          </Td>
          <Td>
            <Badge size="sm" colorScheme={'green'}>
              {member.emissions} kg
            </Badge>
          </Td>
          
          
          
        </Tr>
      ))}
    </Tbody>
  </Table>
)