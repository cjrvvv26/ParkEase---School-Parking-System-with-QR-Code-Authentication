import React from "react";
import { ChevronRight, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function PreviousSemestersTable({ semesters, isLoading }) {
  const navigate = useNavigate();

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleViewDetails = (semester) => {
    navigate(`/semesters/${semester._id}`, { state: { semester } });
  };

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-10 bg-gray-200 rounded mb-2"></div>
        <div className="h-12 bg-gray-200 rounded mb-2"></div>
        <div className="h-12 bg-gray-200 rounded mb-2"></div>
      </div>
    );
  }

  if (!semesters || semesters.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-400">No previous semesters yet</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50">
            <th className="px-5 py-3 text-left">
              <p className="text-xs font-semibold text-gray-500 uppercase">
                Semester Name
              </p>
            </th>
            <th className="px-5 py-3 text-left">
              <p className="text-xs font-semibold text-gray-500 uppercase">
                Start Date
              </p>
            </th>
            <th className="px-5 py-3 text-left">
              <p className="text-xs font-semibold text-gray-500 uppercase">
                End Date
              </p>
            </th>
            <th className="px-5 py-3 text-left">
              <p className="text-xs font-semibold text-gray-500 uppercase">
                Slot Price
              </p>
            </th>
            <th className="px-5 py-3 text-left">
              <p className="text-xs font-semibold text-gray-500 uppercase">
                Revenue
              </p>
            </th>
            <th className="px-5 py-3 text-center">
              <p className="text-xs font-semibold text-gray-500 uppercase">
                Action
              </p>
            </th>
          </tr>
        </thead>
        <tbody>
          {semesters.map((semester) => (
            <tr
              key={semester._id}
              className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <td className="px-5 py-3">
                <p className="text-sm font-medium text-gray-800">
                  {semester.name}
                </p>
              </td>
              <td className="px-5 py-3">
                <p className="text-sm text-gray-600">
                  {formatDate(semester.startDate)}
                </p>
              </td>
              <td className="px-5 py-3">
                <p className="text-sm text-gray-600">
                  {formatDate(semester.endDate)}
                </p>
              </td>
              <td className="px-5 py-3">
                <p className="text-sm text-gray-600">
                  ₱{semester.slotPrice.toLocaleString()}
                </p>
              </td>
              <td className="px-5 py-3">
                <p className="text-sm font-medium text-gray-800">
                  ₱{(semester.revenue || 0).toLocaleString()}
                </p>
              </td>
              <td className="px-5 py-3">
                <div className="flex justify-center">
                  <button
                    onClick={() => handleViewDetails(semester)}
                    className="text-violet-500 hover:text-violet-700 transition-colors p-1"
                    title="View details"
                  >
                    <Eye size={18} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
