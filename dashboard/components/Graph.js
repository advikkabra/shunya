import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { Heading, Text, VStack } from '@chakra-ui/react'
import * as React from 'react'
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const options = {
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
    
  },
};



export function Graph(props){
  const labels = props.months.reverse();

  const data = {
    labels,
    datasets: [
      {
        label: 'Dataset 1',
        data: props.emissions.reverse(),
        borderColor: "#38B2AC",
        backgroundColor: '#38B2AC',
        borderWidth: 3,
        tension: 0.2
      },
      
    ],
};

  return (<Line options={options} data={data} />)

}