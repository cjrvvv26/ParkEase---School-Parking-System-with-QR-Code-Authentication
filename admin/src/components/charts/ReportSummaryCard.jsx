import React from "react";

export default function ReportSummaryCard() {
  return (
    <div className="h-full w-full bg-gray-100 rounded-xl p-5 flex gap-3">
      <div className="flex items-center justify-between w-full">
        {/* Data */}
        <div className="flex flex-col justify-center h-full gap-1">
          <h1 className="text-4xl font-semibold">48</h1>
          <p className="font-medium text-base">Total Students</p>
          {/* Status */}
          <div className="">
            <p className="text-gray-400 text-xs">6 new registered</p>
          </div>
        </div>
        {/* Icon */}
        <div className="flex items-center justify-center rounded-xl p-2 h-20 w-20 bg-gradient-to-br bg-violet-500 text-white">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-9"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
