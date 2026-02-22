import React, { useState } from "react";
import { Edit2, X } from "lucide-react";

export default function CurrentSemesterCard({
  semester,
  onUpdateName,
  isLoading,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(semester?.name || "");

  const handleSave = async () => {
    if (newName.trim() && newName !== semester.name) {
      await onUpdateName(semester._id, newName);
      setIsEditing(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getDaysRemaining = (endDate) => {
    const end = new Date(endDate);
    const today = new Date();
    const diffTime = end - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  if (!semester) {
    return (
      <div className="p-5 rounded-lg bg-gray-100 border border-gray-200">
        <p className="text-gray-500 text-sm">No active semester</p>
      </div>
    );
  }

  const daysRemaining = getDaysRemaining(semester.endDate);

  return (
    <div className="p-5 rounded-lg bg-white border border-gray-200 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-wide">
            Current Semester
          </p>
          {!isEditing ? (
            <h2 className="text-xl font-bold text-gray-800 mt-1">
              {semester.name}
            </h2>
          ) : (
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              autoFocus
              className="text-xl font-bold text-gray-800 mt-1 border border-violet-300 rounded px-2 py-1 outline-none focus:ring-2 focus:ring-violet-400"
            />
          )}
        </div>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="text-gray-400 hover:text-violet-500 transition-colors"
            title="Edit semester name"
          >
            <Edit2 size={18} />
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              disabled={isLoading}
              className="bg-violet-500 text-white px-3 py-1 rounded text-sm hover:bg-violet-600 disabled:opacity-50"
            >
              Save
            </button>
            <button
              onClick={() => {
                setIsEditing(false);
                setNewName(semester.name);
              }}
              className="text-gray-400 hover:text-red-500"
            >
              <X size={18} />
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div>
          <p className="text-xs text-gray-400">Start Date</p>
          <p className="text-sm font-medium text-gray-700 mt-1">
            {formatDate(semester.startDate)}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-400">End Date</p>
          <p className="text-sm font-medium text-gray-700 mt-1">
            {formatDate(semester.endDate)}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-400">Days Remaining</p>
          <p
            className={`text-sm font-medium mt-1 ${
              daysRemaining > 7
                ? "text-green-600"
                : daysRemaining > 0
                  ? "text-yellow-600"
                  : "text-red-600"
            }`}
          >
            {daysRemaining} days
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-400">Slot Price</p>
          <p className="text-sm font-medium text-gray-700 mt-1">
            ₱{semester.slotPrice.toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
}
