import React from "react";
import { Line } from "react-chartjs-2";
import Chart from "chart.js/auto";

export default function MotorOccupancyChart({ chartData = null, loading = false }) {
  const getGradient = (ctx, chartArea) => {
    const height = chartArea ? chartArea.bottom - chartArea.top : ctx.canvas.height;
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, "rgba(142, 81, 255, 0.5)");
    gradient.addColorStop(0.5, "rgba(67, 45, 215, 0.10)");
    gradient.addColorStop(1, "rgb(47, 13, 10, 0.00)");
    return gradient;
  };

  const labels = chartData?.labels || ["5-8 AM", "9-11 AM", "12-2 PM", "3-5 PM", "6-8 PM"];
  const values = chartData?.values || [0, 0, 0, 0, 0];

  const data = {
    labels,
    datasets: [
      {
        data: values,
        fill: true,
        borderColor: "rgba(142, 81, 255, 1)",
        pointBackgroundColor: "rgba(142, 81, 255, 1)",
        pointBorderColor: "rgba(142, 81, 255, 1)",
        pointRadius: 2,
        tension: 0.4,
        backgroundColor: (context) => {
          const chart = context.chart;
          const { ctx, chartArea } = chart;
          return getGradient(ctx, chartArea);
        },
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { mode: "index", intersect: false },
    },
    scales: {
      x: { grid: { display: false }, ticks: { display: false }, border: { display: false } },
      y: { beginAtZero: true, grid: { color: "rgba(229, 231, 235, 0.04)" }, ticks: { display: false }, border: { display: false } },
    },
  };

  if (loading) {
    return <div className="h-full w-full flex items-center justify-center"><p className="text-gray-400 text-sm">Loading...</p></div>;
  }

  return <Line data={data} options={options} />;
}
