import React from 'react';
import Chart from 'chart.js/auto';
import { Bar } from 'react-chartjs-2';

export default function WeeklyScansChart({
  chartData = null,
  loading = false,
}) {
  Chart.register();

  // Mock data for Weekly Scans (Mon-Sun) - matches "same design in mobile app"
  // Real data would come from /report/weekly-scans API
  const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const rawValues = chartData?.values || [12, 15, 18, 22, 30, 8, 5]; // Sample scan counts
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
            ` ${ctx.parsed.y}% of weekly scans (${rawValues[ctx.dataIndex]} scans)`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { font: { size: 12 } },
      },
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
