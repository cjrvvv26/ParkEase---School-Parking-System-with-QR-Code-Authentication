import React from "react";
import ReportSummaryCard from "../components/charts/ReportSummaryCard";
import AdminBldg from "../components/maps/AdminBldg";

export default function Parking() {
  return (
    <>
      {/* Header Page */}
      <header className="flex justify-between px-5 pt-5 items-center">
        <div className="flex flex-col">
          <h1 className="font-bold text-3xl">Parking Management</h1>
          <p className="text-gray-400">
            View and analyze system data through detailed reports and visual
            summaries.
          </p>
        </div>
        {/* Quick Actions (will update) */}
        <div className="flex gap-5"></div>
      </header>
      {/* Parking Report Summary */}
      <div className="flex gap-5 h-[150px] px-5">
        {Array.from({ length: 4 }, () => (
          <ReportSummaryCard />
        ))}
      </div>
      {/* Parking Map and Details */}
      <div className="flex flex-col mx-5 border-gray-200 border rounded-xl mb-5">
        {/* Header Parking Section */}
        <header className="flex justify-between p-5 border-b border-gray-200 w-full">
          <div className="flex gap-3 items-center">
            <h2 className="font-medium text-base">Parking Area Overview</h2>
            <p className="text-xs py-2 px-4 rounded-lg ring ring-violet-500 bg-violet-100 text-violet-500">
              Beta
            </p>
          </div>
          {/* Manage Slots */}
          <button className="flex items-center gap-1 py-2 px-3 rounded-full bg-violet-500 text-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25"
              />
            </svg>
            <p>Manage</p>
          </button>
        </header>
        {/* Content */}
        <main className="flex flex-1">
          {/* Map */}
          <section className="relative px-5 py-20 flex-1">
            {/* Change Parking Area */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6 absolute right-5 -translate-x-1/2 top-1/2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m8.25 4.5 7.5 7.5-7.5 7.5"
              />
            </svg>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6 absolute left-10 top-1/2 -translate-x-1/2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 19.5 8.25 12l7.5-7.5"
              />
            </svg>

            {/* Map Name & Zoom btn */}
            <button className="absolute top-5 left-5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15"
                />
              </svg>
            </button>
            {/* Legends */}
            <div className="flex items-center justify-between absolute top-5 right-5">
              <div className="flex gap-3">
                <div className="flex items-center gap-1 text-xs text-gray-400">
                  <div class="relative flex items-center justify-center w-10 h-10">
                    <div class="absolute w-9 h-9 rounded-full bg-green-100 opacity-50 z-10"></div>

                    <div class="absolute w-6 h-6 rounded-full bg-green-300 opacity-[.3] z-0"></div>

                    <div class="relative w-3 h-3 rounded-full bg-green-500 -z-0"></div>
                  </div>

                  <p>Available</p>
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-400">
                  <div class="relative flex items-center justify-center w-10 h-10">
                    <div class="absolute w-9 h-9 rounded-full bg-rose-100 opacity-50 z-10"></div>

                    <div class="absolute w-6 h-6 rounded-full bg-rose-300 opacity-[.3] z-0"></div>

                    <div class="relative w-3 h-3 rounded-full bg-rose-500 -z-0"></div>
                  </div>
                  <p>Occupied</p>
                </div>
              </div>
            </div>
            {/* Area name */}
            <p className="text-center px-4 py-2 bg-violet-100 text-xs text-violet-500 absolute bottom-5 right-5 rounded-xl ring ring-violet-500">
              Admin Building Area
            </p>
            <div className="h-full flex items-center">
              <AdminBldg />
            </div>
          </section>
          {/* Parking Details */}
          <section className="w-[400px] border-l border-gray-200 flex flex-col p-5 items-center justify-center gap-1">
            <div className="flex gap-2 items-center text-base font-medium">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
                />
              </svg>
              <h2>No slot selected</h2>
            </div>
            <p className="text-xs text-gray-400">
              Click a parking slot on the map to view details here.
            </p>
          </section>
        </main>
      </div>
    </>
  );
}
