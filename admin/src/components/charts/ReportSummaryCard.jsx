import React from "react";
import {
  Check,
  SquareDashedBottom,
  X,
  UserRoundCheck,
  Users,
  TrendingUp,
} from "lucide-react";

export default function ReportSummaryCard({ reports = [], loading, stats }) {
  const renderIcon = (title) => {
    switch (title) {
      case "Total Slots":
        return <SquareDashedBottom size={30} />;
      case "Total Exclusive":
        return <UserRoundCheck size={30} />;
      case "Total Available":
        return <Check size={30} />;
      case "Total Occupied":
        return <X size={30} />;
      case "Students Paid":
        return <Users size={30} />;
      case "Occupancy Rate":
        return <TrendingUp size={30} />;
      default:
        return <SquareDashedBottom size={30} />;
    }
  };

  // If semester stats are provided, transform them to display format
  const displayData = stats
    ? [
        { title: "Students Paid", data: stats.totalStudentsPaid },
        { title: "Total Slots", data: stats.totalSlots },
        { title: "Occupied Slots", data: stats.occupiedSlots },
        { title: "Total Available", data: stats.availableSlots },
      ]
    : reports;

  if (loading) {
    return Array.from({ length: 4 }, (_, index) => (
      <div
        key={index}
        className="h-full w-full animate-pulse bg-gray-100 rounded-xl p-5 flex gap-3"
      >
        <div className="flex items-center justify-between w-full">
          <div className="flex flex-col justify-center h-full gap-1">
            <div className="w-32 h-3 rounded-md bg-gray-200"></div>
            <div className="w-24 mt-2 h-3 rounded-md bg-gray-200"></div>
          </div>
          <div className="rounded-xl h-20 w-20 bg-gray-200"></div>
        </div>
      </div>
    ));
  }

  return displayData.map((item, index) => (
    <div
      key={index}
      className="h-full w-full bg-gray-100 rounded-xl p-5 flex gap-3"
    >
      <div className="flex items-center justify-between w-full">
        <div className="flex flex-col justify-center h-full gap-1">
          <h1 className="text-4xl font-semibold">{item.data}</h1>
          <p className="font-medium text-base">{item.title}</p>
          <p className="text-gray-400 text-xs">Current semester</p>
        </div>

        <div className="flex items-center justify-center rounded-xl p-2 h-20 w-20 bg-violet-500 text-white">
          {renderIcon(item.title)}
        </div>
      </div>
    </div>
  ));
}
