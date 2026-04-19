import React from 'react';
import { Bar } from 'react-chartjs-2';

export default function AvgParkingDurationChart({
  chartData = null,
  loading = false,
}) {
  const labels = chartData?.labels || [
    '5-8 AM',
    '9-11 AM',
    '12-2 PM',
    '3-5 PM',
  ];
  const values = chartData?.values || [0, 0, 0, 0];
  const total = values.reduce((sum, value) => sum + value, 0);
  const percentageValues = total
    ? values.map((value) => Number(((value / total) * 100).toFixed(1)))
    : [0, 0, 0, 0];

  const data = {
    labels,
    datasets: [
      {
        data: percentageValues,
        backgroundColor: '#3b82f6',
        borderColor: '#2563eb',
        borderWidth: 1,
        borderRadius: 10,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => `Share of active users: ${ctx.parsed.y}%`,
        },
      },
    },
    scales: {
      x: { grid: { display: false } },
      y: {
        grid: { color: 'rgba(229, 231, 235, 0.04)' },
        beginAtZero: true,
        max: 100,
        ticks: {
          callback: (v) => `${v}%`,
        },
      },
    },
  };

  if (loading) {
    return (
      <div className='h-full w-full flex items-center justify-center'>
        <p className='text-gray-400 text-sm'>Loading...</p>
      </div>
    );
  }

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <Bar data={data} options={options} />
    </div>
  );
}
