import React from "react";
import { CircleUserRound } from "lucide-react";

export default function Details({ selectedShape }) {
  return (
    <section
      className={`${!selectedShape && "justify-center"} w-[400px] border-l border-gray-200 flex flex-col p-5 items-center gap-1 `}
    >
      {selectedShape ? (
        <div className="flex flex-col items-center h-full justify-between gap-4 w-full">
          <div className="text-left w-full">
            <div className="flex gap-2 hover:bg-gray-50 p-2 rounded-md">
              {selectedShape}
            </div>
            <p className="text-sm text-gray-600">
              <strong>Type:</strong> {selectedShape.metadata.type}
            </p>
            <p className="text-sm text-gray-600">
              <strong>ID:</strong> {selectedShape._id || selectedShape.tempId}
            </p>
            {selectedShape.metadata.type === "slot" && (
              <p className="text-sm text-gray-600">
                <strong>Status:</strong>
              </p>
            )}
            {selectedShape.metadata.type === "bldg" && (
              <p className="text-sm text-gray-600">
                <strong>Name:</strong> Building
              </p>
            )}
          </div>
          {selectedShape.metadata.type === "slot" && (
            <button className="rounded-md w-full py-2 text-sm text-white bg-violet-500 flex items-center justify-center gap-3">
              <CircleUserRound strokeWidth={1.5} />
              <span>Assign Student</span>
            </button>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-1">
          <div className="flex gap-2 items-center justify-center text-base font-medium">
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
          <p className="text-xs text-center text-gray-400">
            Click a parking slot or building on the map to view details here.
          </p>
        </div>
      )}
    </section>
  );
}
