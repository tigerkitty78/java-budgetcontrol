import { useEffect } from 'react';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

// Register components
ChartJS.register(ArcElement, Tooltip, Legend);

const DoughnutChart = () => {

    
  const data = {
    labels: [  'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    datasets: [
      {
        label: 'Traffic',
        data: [  2545, 3423, 2365, 1985, 987],
        backgroundColor: [
          
          '#1A6652',
          '#87D0A3',
          '#B7E6C9',
          '#26876D',
          
          '#165041',
        ],
      },
    ],
  };
 
  return <Doughnut data={data} />;
};

export default DoughnutChart;
