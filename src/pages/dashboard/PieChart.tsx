import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title, RadialLinearScale } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(ArcElement, Tooltip, Legend, Title, RadialLinearScale, ChartDataLabels);

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
      position: 'right' as const,
      labels: {
        usePointStyle: true,
        pointStyle: 'circle',
      },
    },
    title: {
      display: true,
      text: 'Card Stock Summary',
      font: {
        size: 14,
      },
    },
  }
};

interface Props {
	data: any;
}

const PieChart: React.FC<Props> = ({
	data
}) => {
  return <Pie data={data} options={options} />;
}
export default PieChart;
