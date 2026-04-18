import React, { useRef, useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import Chart from "chart.js/auto";
import { ChevronLeft, ChevronRight } from "lucide-react";

const PAGE_SIZE = 5;

export default function RevenueChart({ monthlyData = null, loading = false }) {
  Chart.register();

  const chartRef = useRef(null);
  const [page, setPage] = useState(0);

  const allLabels = monthlyData?.labels || [];
  const allValues = monthlyData?.values || [];
  const allMeta = monthlyData?.meta || [];
  const totalPages = Math.ceil(allLabels.length / PAGE_SIZE);

  // Always start on the last page (most recent semesters)
  useEffect(() => {
    if (totalPages > 0) setPage(totalPages - 1);
  }, [totalPages]);

  const start = page * PAGE_SIZE;
  const chartLabels = allLabels.slice(start, start + PAGE_SIZE);
  const chartValues = allValues.slice(start, start + PAGE_SIZE);
  const chartMeta = allMeta.slice(start, start + PAGE_SIZE);

  function getGradient(ctx, chartArea) {
    const height = chartArea ? chartArea.bottom - chartArea.top : ctx.canvas.height;
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, "rgba(59, 130, 246, 0.5)");
    gradient.addColorStop(0.5, "rgba(37, 99, 235, 0.10)");
    gradient.addColorStop(1, "rgb(0, 0, 0, 0.00)");
    return gradient;
  }

  const data = {
    labels: chartLabels,
    datasets: [
      {
        data: chartValues,
        fill: true,
        tension: 0.4,
        borderWidth: 2,
        borderColor: "rgba(59, 130, 246, 1)",
        pointRadius: 6,
        pointHoverRadius: 8,
        pointBackgroundColor: "rgba(59, 130, 246, 1)",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
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
      tooltip: {
        mode: "index",
        intersect: false,
        callbacks: {
          title: (items) => {
            const i = items[0]?.dataIndex;
            return chartMeta[i]?.name || chartLabels[i] || '';
          },
          label: (ctx) => ` Revenue: ₱${ctx.parsed.y.toLocaleString()}`,
          afterLabel: (ctx) => {
            const m = chartMeta[ctx.dataIndex];
            if (!m) return '';
            const fmt = (d) => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—';
            return [`  Start: ${fmt(m.startDate)}`, `  End:   ${fmt(m.endDate)}`];
          },
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { font: { size: 10 }, maxRotation: 20 },
      },
      y: {
        beginAtZero: true,
        grid: { color: "rgba(229, 231, 235, 0.08)" },
        ticks: { callback: (v) => `₱${v.toLocaleString()}` },
      },
    },
  };

  useEffect(() => {
    if (!chartRef.current) return;
    const container = chartRef.current?.canvas?.parentElement || chartRef.current.canvas;
    if (!container) return;
    const ro = new ResizeObserver(() => { try { chartRef.current?.resize?.(); } catch (e) {} });
    ro.observe(container);
    const t = setTimeout(() => chartRef.current?.resize?.(), 350);
    return () => { ro.disconnect(); clearTimeout(t); };
  }, [chartValues]);

  if (loading || !monthlyData) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <p className="text-gray-400">Loading chart data...</p>
      </div>
    );
  }

  if (allLabels.length === 0) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <p className="text-gray-400 text-sm">No semester data yet</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full gap-2">
      {/* Navigation */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-1">
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            className="p-1.5 rounded-lg hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition"
          >
            <ChevronLeft size={16} />
          </button>
          <span className="text-xs text-gray-400">
            {page + 1} / {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page === totalPages - 1}
            className="p-1.5 rounded-lg hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}
      {/* Chart */}
      <div style={{ position: "relative", width: "100%", flex: 1 }}>
        <Line ref={chartRef} data={data} options={options} />
      </div>
    </div>
  );
}
