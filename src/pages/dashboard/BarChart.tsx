import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels
);

export const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    layout: {
      margin: {
        left: 0,
        right: '10px',
        top: 0,
        bottom: 0,
      },
    },
    datalabels: {
      mode: true,
      color: '#fff', // Label text color
      formatter: (value: any) => {
        return value;
      },
    },
    legend: {
      position: 'top' as const,
    },
    title: {
      display: true,
      text: 'Card Received Summary',
      font: {
        size: 14,
      },
    },
  }
};

interface Props {
	data: any;
}

const BarChart: React.FC<Props> = ({
	data
}) => {
  return <Bar data={data} options={options} />;
}
export default BarChart;