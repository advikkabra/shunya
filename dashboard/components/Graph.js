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

const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];

const data = {
  labels,
  datasets: [
    {
      label: 'Dataset 1',
      data: [10, 20, 30, 20, 50, 60, 40],
      borderColor: "#38B2AC",
      backgroundColor: '#38B2AC',
      borderWidth: 3,
      tension: 0.2
    },
    
  ],
};

export const Graph = (props) => (
  <Line options={options} data={data} />
)