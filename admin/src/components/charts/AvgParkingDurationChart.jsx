import React from 'react';
import Chart from 'chart.js/auto';
import { Bar } from 'react-chartjs-2';
import useDark from '../../hooks/useDark';

Chart.register();

function formatMins(mins) {
  if (!mins) return '0m';
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (h > 0 && m > 0) return `${h}h ${m}m`;
  if (h > 0) return `${h}h`;
  return `${m}m`;
}

export default function AvgParkingDurationChart({ chartData = null, loading = false }) {
  const { dark } = useDark();

  const labels = chartData?.labels || ['5-8 AM', '9-11 AM', '12-2 PM', '3-5 PM'];
  const values = chartData?.values ?? [0, 0, 0, 0];
  const activeDays = chartData?.activeDays || 0;
  const totalSessions = chartData?.totalSessions || 0;

  const tickColor = dark ? '#9ca3af' : '#6b7280';
  const gridColor = dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';

  const maxVal = Math.max(...values, 1);

  const data = {
    labels,
    datasets: [{
      label: 'Avg Duration',
      data: values,
      backgroundColor: 'rgba(59,130,246,0.7)',
      borderColor: '#2563eb',
      borderWidth: 1,
      borderRadius: 10,
    }],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => `Avg: ${formatMins(ctx.parsed.y)}`,
          afterLabel: () =>
            totalSessions > 0
              ? `From ${totalSessions} session(s) over ${activeDays} day(s)`
              : 'No sessions recorded',
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
        suggestedMax: maxVal + Math.ceil(maxVal * 0.2) || 60,
        ticks: {
          color: tickColor,
          callback: (v) => formatMins(v),
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
      {totalSessions === 0 && (
        <p className='absolute inset-0 flex items-center justify-center text-gray-400 text-sm pointer-events-none z-10'>
          No parking duration data in the last 30 days
        </p>
      )}
      <Bar data={data} options={options} />
    </div>
  );
}
