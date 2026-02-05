import React from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const ActivityChart = ({ activityData = [] }) => {
  const labels = activityData.length
    ? activityData.map((d) => d.date)
    : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const values = activityData.length
    ? activityData.map((d) => d.count)
    : [4, 7, 3, 9, 6, 2, 5];

  const data = {
    labels,
    datasets: [{
      label: 'Activity',
      data: values,
      borderColor: '#3b82f6',
      backgroundColor: 'rgba(59,130,246,0.08)',
      borderWidth: 2,
      fill: true,
      tension: 0.4,
      pointBackgroundColor: '#3b82f6',
      pointRadius: 3,
      pointHoverRadius: 5,
    }],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      y: { beginAtZero: true, grid: { color: '#f1f5f9' }, ticks: { precision: 0 } },
      x: { grid: { display: false } },
    },
  };

  return (
    <div style={{ height: 240 }}>
      <Line data={data} options={options} />
    </div>
  );
};

export default ActivityChart;