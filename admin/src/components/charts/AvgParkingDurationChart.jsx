import React from "react";
import Chart from "chart.js/auto";
import { Bar } from "react-chartjs-2";

export default function AvgParkingDurationChart({ chartData = null, loading = false }) {
  Chart.register();

  const labels = chartData?.labels || ["5-8 AM", "9-11 AM", "12-2 PM", "3-5 PM"];
  const values = chartData?.values || [0, 0, 0, 0];

  const data = {
    labels,
    datasets: [
      {
        data: values,
        backgroundColor: "#3b82f6",
        borderColor: "#2563eb",
        borderWidth: 1,
        borderRadius: 10,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { display: false } },
      y: { grid: { color: "rgba(229, 231, 235, 0.04)" } },
    },
  };

  if (loading) {
    return <div className="h-full w-full flex items-center justify-center"><p className="text-gray-400 text-sm">Loading...</p></div>;
  }

  return <Bar data={data} options={options} />;
}
