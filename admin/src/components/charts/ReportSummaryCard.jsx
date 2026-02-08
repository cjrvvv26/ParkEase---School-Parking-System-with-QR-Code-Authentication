import React from "react";
import {
  Brackets,
  Check,
  SquareDashedBottom,
  X,
  UserRoundCheck,
} from "lucide-react";

export default function ReportSummaryCard({ reports = [], loading }) {
  if (loading) {
    return Array.from({ length: 4 }, () => (
      <div className="h-full w-full animate-pulse bg-gray-100 rounded-xl p-5 flex gap-3">
        <div className="flex items-center justify-between w-full">
          {/* Data */}
          <div className="flex flex-col justify-center h-full gap-1">
            <h1 className="text-4xl font-semibold w-32 h-3 rounded-md bg-gray-200"></h1>
            <p className="font-medium text-base w-24 mt-2 h-3 rounded-md bg-gray-200"></p>
            {/* Status */}
            <div className="">
              <p className="text-gray-400 text-xs"></p>
            </div>
          </div>
          {/* Icon */}
          <div className="flex items-center justify-center rounded-xl p-2 h-20 w-20 bg-gradient-to-br bg-gray-200 animate-pulse text-white"></div>
        </div>
      </div>
    ));
  }

  return reports.map((report, index) => (
    <div
      key={index}
      className="h-full w-full bg-gray-100 rounded-xl p-5 flex gap-3"
    >
      <div className="flex items-center justify-between w-full">
        {/* Data */}
        <div className="flex flex-col justify-center h-full gap-1">
          <h1 className="text-4xl font-semibold">{report.data}</h1>
          <p className="font-medium text-base">{report.title}</p>
          {/* Status */}
          <div className="">
            <p className="text-gray-400 text-xs">6 new registered</p>
          </div>
        </div>
        {/* Icon */}
        <div className="flex items-center justify-center rounded-xl p-2 h-20 w-20 bg-gradient-to-br bg-violet-500 text-white">
          {report.title === "Total Slots" ? (
            <SquareDashedBottom size={30} />
          ) : report.title === "Total Exclusive" ? (
            <UserRoundCheck size={30} />
          ) : report.title === "Total Available" ? (
            <Check size={30} />
          ) : (
            <X size={30} />
          )}
        </div>
      </div>
    </div>
  ));
}
