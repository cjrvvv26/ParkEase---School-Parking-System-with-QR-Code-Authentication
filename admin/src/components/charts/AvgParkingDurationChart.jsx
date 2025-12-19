import React from "react";
import Chart from "chart.js/auto";
import { Bar } from "react-chartjs-2";

export default function AvgParkingDurationChart() {
  Chart.register();

  const data = {
    labels: ["5-8 AM", "9-11 PM", "12-2 PM", "3-5 PM"],
    datasets: [
      {
        data: [12, 19, 10, 15],
        backgroundColor: "#8e51ff",
        borderColor: "#6233c1",
        borderWidth: 1,
        borderRadius: 10,
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
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        grid: {
          color: "rgba(229, 231, 235, 0.04)",
        },
      },
    },
  };

  return <Bar data={data} options={options} />;
}
