import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import styled from 'styled-components';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const ChartContainer = styled.div`
  padding: 20px;
  border-radius: 20px;
  background-color: white;
  margin: 15px;
`;

const LegendContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  margin-top: 10px;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  margin-right: 10px;
  margin-bottom: 5px;
`;

const LegendDot = styled.div<{color: string}>`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: ${props => props.color};
  margin-right: 5px;
`;

const EmotionChart: React.FC = () => {
  const labels = ['', '', '', '', ''];
  
  const data = {
    labels,
    datasets: [
      {
        label: 'Clarity',
        data: [70, 75, 72, 68, 74],
        borderColor: '#9D4EDD',
        backgroundColor: '#9D4EDD',
        fill: '+1',
      },
      {
        label: 'Empathy',
        data: [60, 65, 62, 58, 64],
        borderColor: '#FFFF00',
        backgroundColor: '#FFFF00',
        fill: '+1',
      },
      {
        label: 'Anger',
        data: [50, 55, 52, 48, 54],
        borderColor: '#FF0000',
        backgroundColor: '#FF0000',
        fill: '+1',
      },
      {
        label: 'Sincerity',
        data: [40, 45, 42, 38, 44],
        borderColor: '#00A86B',
        backgroundColor: '#00A86B',
        fill: '+1',
      },
      {
        label: 'Bias',
        data: [30, 35, 32, 28, 34],
        borderColor: '#0000FF',
        backgroundColor: '#0000FF',
        fill: '+1',
      },
      {
        label: 'Escalation',
        data: [20, 25, 22, 18, 24],
        borderColor: '#808080',
        backgroundColor: '#808080',
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        display: false,
      },
      y: {
        display: false,
      },
    },
    elements: {
      point: {
        radius: 0,
      },
      line: {
        tension: 0.4,
      },
    },
  };

  const legendItems = [
    { label: 'Escalation', color: '#808080' },
    { label: 'Bias', color: '#0000FF' },
    { label: 'Clarity', color: '#9D4EDD' },
    { label: 'Sincerity', color: '#00A86B' },
    { label: 'Anger', color: '#FF0000' },
    { label: 'Empathy', color: '#FFFF00' },
  ];

  return (
    <ChartContainer>
      <div style={{ height: '200px' }}>
        <Line data={data} options={options} />
      </div>
      <LegendContainer>
        {legendItems.map((item, index) => (
          <LegendItem key={index}>
            <LegendDot color={item.color} />
            <span>{item.label}</span>
          </LegendItem>
        ))}
      </LegendContainer>
    </ChartContainer>
  );
};

export default EmotionChart;