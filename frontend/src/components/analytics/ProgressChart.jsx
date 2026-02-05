import React from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const COLORS = ['#3b82f6', '#22c55e', '#8b5cf6', '#f59e0b', '#ec4899', '#14b8a6', '#f97316', '#6366f1'];

const ProgressChart = ({ projects = [] }) => {
  const labels = projects.length
    ? projects.map((p) => p.name)
    : ['Project A', 'Project B', 'Project C', 'Project D'];

  const values = projects.length
    ? projects.map((p) => {
        const total = p.taskCount || 1;
        return Math.round(((p.completedTaskCount || 0) / total) * 100);
      })
    : [65, 80, 45, 90];

  const data = {
    labels,
    datasets: [{
      label: 'Completion %',
      data: values,
      backgroundColor: labels.map((_, i) => COLORS[i % COLORS.length]),
      borderRadius: 6,
      borderSkipped: false,
    }],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { callbacks: { label: (ctx) => `${ctx.parsed}% complete` } },
    },
    scales: {
      y: { beginAtZero: true, max: 100, ticks: { callback: (v) => `${v}%` }, grid: { color: '#f1f5f9' } },
      x: { grid: { display: false } },
    },
  };

  return (
    <div style={{ height: 240 }}>
      <Bar data={data} options={options} />
    </div>
  );
};

export default ProgressChart;