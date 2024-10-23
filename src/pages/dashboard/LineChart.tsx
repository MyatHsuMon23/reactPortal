import React from 'react';
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
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels
);

export const options = {
  responsive: true,
  lineTension: 0.5,
  maintainAspectRatio: false,
  plugins: {
    datalabels: {
      mode: true,
      color: '#333', // Label text color
      backgroundColor: '#d8dcfe85',
      formatter: (value: any) => {
        return value;
      },
    },
    legend: {
      position: 'top' as const,
    },
    title: {
      display: true,
      text: 'KYC Update Summary',
      font: {
        size: 14,
      },
    },
  }
};

const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];

export const data = {
  labels,
  datasets: [
    {
      label: 'Credit KYC',
      data: [30,30,12, 31, 29, 40],
      borderColor: '#845EC2',
      backgroundColor: '#845EC2',
    },
    {
      label: 'Debit KYC',
      data: [10,22,30, 21, 26, 10],
      borderColor: '#D65DB1',
      backgroundColor: '#D65DB1',
    },
    {
      label: 'Business KYC',
      data: [16,12,22, 11, 9, 10],
      borderColor: '#FF9671',
      backgroundColor: '#FF9671',
    },
  ],
};

export function LineChart() {
  return <Line options={options} data={data} />;
}
