import React, { useRef, useEffect } from "react";
import { Line } from "react-chartjs-2";
import Chart from "chart.js/auto";

export default function RevenueChart() {
  Chart.register();

  function getGradient(ctx, chartArea) {
    const height = chartArea
      ? chartArea.bottom - chartArea.top
      : ctx.canvas.height;
    const gradient = ctx.createLinearGradient(0, 0, 0, height);

    gradient.addColorStop(0, "rgba(142, 81, 255, 0.5)");
    gradient.addColorStop(0.5, "rgba(67, 45, 215, 0.10)");
    gradient.addColorStop(1, "rgb(47, 13, 10, 0.00)");
    return gradient;
  }

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
        data: [100, 80, 80, 81, 56, 70, 132, 70, 75, 90, 100, 120],
        fill: true,
        tension: 0.3,
        borderWidth: 2,
        borderColor: "rgba(142, 81, 255, 1)",
        pointRadius: 2,
        pointBackgroundColor: "rgba(142, 81, 255, 1)",
        pointBorderColor: "rgba(142, 81, 255, 1)",
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

  useEffect(
    () => {
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
    },
    [
      /* deps: data/options if needed */
    ]
  );

  return (
    <Line
      ref={chartRef}
      data={data}
      options={options}
      className="h-full w-full"
    />
  );
}
