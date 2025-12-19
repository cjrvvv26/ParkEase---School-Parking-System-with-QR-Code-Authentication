import React from "react";
import { Line } from "react-chartjs-2";
import Chart from "chart.js/auto";

export default function MotorOccupancyChart() {
  const getGradient = (ctx, chartArea) => {
    const height = chartArea
      ? chartArea.bottom - chartArea.top
      : ctx.canvas.height;
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, "rgba(142, 81, 255, 0.5)");
    gradient.addColorStop(0.5, "rgba(67, 45, 215, 0.10)");
    gradient.addColorStop(1, "rgb(47, 13, 10, 0.00)");
    return gradient;
  };

  const data = {
    labels: ["5-8 AM", "9-11 PM", "12-2 PM", "3-5 PM", "6-8 PM"],
    datasets: [
      {
        data: [65, 59, 80, 81, 56],
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
      legend: {
        display: false,
      },
      tooltip: { mode: "index", intersect: false },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          display: false,
        },
        border: { display: false },
      },
      y: {
        beginAtZero: false,
        grid: {
          color: "rgba(229, 231, 235, 0.04)",
        },
        ticks: {
          display: false,
        },
        border: { display: false },
      },
    },
  };
  return <Line data={data} options={options} />;
}
