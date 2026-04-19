import React from 'react';
import { Bar } from 'react-chartjs-2';
import Chart from 'chart.js/auto';

export default function OccupancyRateChart({
  chartData = null,
  loading = false,
}) {
  Chart.register();

  const labels = chartData?.labels || [
    '5-8 AM',
    '9-11 AM',
    '12-2 PM',
    '3-5 PM',
    '6-8 PM',
  ];
  const rawValues = chartData?.values || [0, 0, 0, 0, 0];
  const total = rawValues.reduce((s, v) => s + v, 0);
  const values = rawValues.map((v) =>
    total > 0 ? Math.round((v / total) * 100) : 0,
  );

  const data = {
    labels,
    datasets: [
      {
        data: values,
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
          label: (ctx) =>
            ` ${ctx.parsed.y}% (${rawValues[ctx.dataIndex]} entries)`,
        },
      },
    },
    scales: {
      x: { grid: { display: false } },
      y: {
        grid: { color: 'rgba(229, 231, 235, 0.04)' },
        beginAtZero: true,
        max: 100,
        ticks: { callback: (v) => `${v}%` },
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
