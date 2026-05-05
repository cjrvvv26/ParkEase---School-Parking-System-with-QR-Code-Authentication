import React from 'react';
import { Bar } from 'react-chartjs-2';
import useDark from '../../hooks/useDark';

function formatMinutes(mins) {
  if (!mins) return '0m';
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (h > 0 && m > 0) return `${h}h ${m}m`;
  if (h > 0) return `${h}h`;
  return `${m}m`;
}

export default function AvgParkingDurationChart({
  chartData = null,
  loading = false,
}) {
  const { dark } = useDark();
  const labels = chartData?.labels || ['5-8 AM', '9-11 AM', '12-2 PM', '3-5 PM'];
  const values = chartData?.values || [0, 0, 0, 0];

  const hasData = values.some((v) => v > 0);

  const data = {
    labels,
    datasets: [
      {
        label: 'Avg Duration (mins)',
        data: values,
        backgroundColor: 'rgba(59,130,246,0.7)',
        borderColor: '#2563eb',
        borderWidth: 1,
        borderRadius: 10,
      },
    ],
  };

  const tickColor = dark ? '#9ca3af' : '#6b7280';
  const gridColor = dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => `Avg: ${formatMinutes(ctx.parsed.y)}`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: tickColor },
      },
      y: {
        grid: { color: gridColor },
        beginAtZero: true,
        ticks: {
          color: tickColor,
          callback: (v) => formatMinutes(v),
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

  if (!hasData) {
    return (
      <div className='h-full w-full flex items-center justify-center'>
        <p className='text-gray-400 text-sm'>No parking duration data yet</p>
      </div>
    );
  }

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <Bar data={data} options={options} />
    </div>
  );
}
