import React, { useRef, useEffect } from "react";
import { Line } from "react-chartjs-2";
import Chart from "chart.js/auto";

export default function RevenueChart({ monthlyData = null, loading = false }) {
  Chart.register();

  function getGradient(ctx, chartArea) {
    const height = chartArea
      ? chartArea.bottom - chartArea.top
      : ctx.canvas.height;
    const gradient = ctx.createLinearGradient(0, 0, 0, height);

    gradient.addColorStop(0, "rgba(59, 130, 246, 0.5)");
    gradient.addColorStop(0.5, "rgba(37, 99, 235, 0.10)");
    gradient.addColorStop(1, "rgb(0, 0, 0, 0.00)");
    return gradient;
  }

  // Use provided monthly data or default
  const chartData = monthlyData || [
    100, 80, 80, 81, 56, 70, 132, 70, 75, 90, 100, 120,
  ];

  const data = {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    datasets: [
      {
        data: chartData,
        fill: true,
        tension: 0.3,
        borderWidth: 2,
        borderColor: "rgba(59, 130, 246, 1)",
        pointRadius: 2,
        pointBackgroundColor: "rgba(59, 130, 246, 1)",
        pointBorderColor: "rgba(59, 130, 246, 1)",
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
      },
      y: {
        beginAtZero: false,
        grid: {
          color: "rgba(229, 231, 235, 0.04)",
        },
      },
    },
  };

  const chartRef = useRef(null);

  useEffect(() => {
    if (!chartRef.current) return;
    const container =
      chartRef.current?.canvas?.parentElement || chartRef.current.canvas;
    if (!container) return;

    const ro = new ResizeObserver(() => {
      try {
        chartRef.current?.resize?.();
      } catch (e) {}
    });
    ro.observe(container);

    // small fallback
    const t = setTimeout(() => chartRef.current?.resize?.(), 350);

    return () => {
      ro.disconnect();
      clearTimeout(t);
    };
  }, [chartData]);

  if (loading) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <p className="text-gray-400">Loading chart data...</p>
      </div>
    );
  }

  return (
    <Line
      ref={chartRef}
      data={data}
      options={options}
      className="h-full w-full"
    />
  );
}
