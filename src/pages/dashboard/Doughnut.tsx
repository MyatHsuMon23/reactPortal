import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(ArcElement, Tooltip, Legend, Title, ChartDataLabels);

export const options = {
  responsive: true,
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
      labels: {
        usePointStyle: true,
        pointStyle: 'circle',
      },
    },
    title: {
      display: true,
      text: 'Adjustment Cards By Status',
      font: {
        size: 14,
      },
    },
  }
};

interface Props {
	data: any;
}

const DoughnutChart: React.FC<Props> = ({
	data
}) => {
  return <Doughnut data={data} options={options} />;
}
export default DoughnutChart;
