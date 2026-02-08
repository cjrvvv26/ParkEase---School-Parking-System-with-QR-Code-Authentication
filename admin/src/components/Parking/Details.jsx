import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Settings } from "lucide-react";
import Modal from "../Modal";
import SlotManagement from "./SlotManagement";

export default function Details({ selectedShape, loading }) {
  const [isOpen, setIsOpen] = useState(false);
  const [updatedSlot, setUpdatedSlot] = useState(selectedShape);
  console.log(updatedSlot);

  useEffect(() => {
    setUpdatedSlot(selectedShape);
  }, [selectedShape]);

  const refreshSlot = (slot) => {
    setUpdatedSlot(slot);
  };

  return (
    <section
      className={`${!updatedSlot && "justify-center"} w-[400px] border-l border-gray-200 flex flex-col p-5 items-center gap-1`}
    >
      {updatedSlot ? (
        <div className="flex flex-col items-center h-full justify-between gap-4 w-full">
          <div className="text-left w-full">
            {updatedSlot.metadata?.type === "slot" &&
            updatedSlot.assignedStudentId ? (
              <div className="flex flex-col mb-5 gap-5">
                {/* Profile Details */}
                <div className="flex gap-3 items-center border-b pb-2 border-gray-200">
                  <img
                    src={updatedSlot.profileDetails?.url}
                    alt={updatedSlot.profileDetails?.url}
                    className="h-32 w-32 ring-1 ring-gray-200 rounded-md"
                  />
                  <div className="flex flex-col gap-5 overflow-hidden w-full">
                    <div className="flex flex-col gap-1">
                      <p className="text-gray-600 font-medium w-full truncate">
                        {updatedSlot.name.firstName +
                          " " +
                          updatedSlot.name.middleName.charAt(0) +
                          ". " +
                          updatedSlot.name.lastName}
                      </p>
                      <p className="text-gray-400">{updatedSlot.studentNo}</p>
                      <p className="text-gray-400">
                        {updatedSlot.yearLevel + " - " + updatedSlot.course}
                      </p>
                      <div className="flex gap-1">
                        <p
                          className={`${updatedSlot.status === "active" ? "text-green-500 bg-green-100" : "text-red-500 bg-red-100"} text-xs py-1 px-2 rounded-sm self-start`}
                        >
                          {updatedSlot.status.charAt(0).toUpperCase() +
                            updatedSlot.status.slice(1)}
                        </p>
                        <p
                          className={`${updatedSlot.payment.isPaid ? "text-blue-500 bg-blue-100" : "text-red-500 bg-red-100"} text-xs py-1 px-2 rounded-sm self-start`}
                        >
                          {updatedSlot.payment.isPaid ? "Paid" : "Not Paid"}
                        </p>
                        <p
                          className={`${updatedSlot.userId === updatedSlot.assignedStudentId ? "text-orange-500 bg-orange-100" : "text-red-500 bg-red-100"} text-xs py-1 px-2 rounded-sm self-start`}
                        >
                          {updatedSlot.userId === updatedSlot.assignedStudentId
                            ? "In-Slot"
                            : "Valid Parking"}
                        </p>
                      </div>
                    </div>
                    <Link
                      to={`users/${updatedSlot._id}`}
                      className="hover:underline text-gray-400 hover:text-violet-500 text-xs"
                    >
                      View
                    </Link>
                  </div>
                </div>
                {/* Motorcycle Details */}
                <div className="flex flex-col gap-3 border-b border-gray-200 pb-2">
                  <h2 className="font-medium text-base">Motorcycle Details</h2>
                  {Object.entries(updatedSlot.motorDetails)
                    .slice(0, 4)
                    .map(([key, value]) => (
                      <p
                        key={key}
                        className="text-sm text-gray-600 w-full flex justify-between"
                      >
                        <span className="text-gray-400">
                          {key.charAt(0).toUpperCase() + key.slice(1)}:
                        </span>{" "}
                        <span className=" text-gray-600">{value}</span>
                      </p>
                    ))}
                </div>
              </div>
            ) : (
              <div className="h-32 rounded-md mb-5 bg-gray-100 w-full flex text-gray-400 items-center justify-center">
                Slot still available
              </div>
            )}
            <p className="text-sm text-gray-600 w-full flex justify-between">
              <span className="text-gray-400">Label:</span>{" "}
              {updatedSlot.metadata.label.charAt(0).toUpperCase() +
                updatedSlot.metadata.label.slice(1)}
            </p>
            <p className="text-sm text-gray-600 w-full flex justify-between">
              <span className="text-gray-400">Type:</span>{" "}
              {updatedSlot.metadata.type.charAt(0).toUpperCase() +
                updatedSlot.metadata.type.slice(1)}
            </p>
            {updatedSlot.metadata.type === "slot" && (
              <p className="text-sm text-gray-600 w-full flex justify-between">
                <span className="text-gray-400">Status: </span>
                {updatedSlot.assignedStudentId
                  ? "Exclusive"
                  : updatedSlot.occupiedBy
                    ? "Occupied"
                    : "Available"}
              </p>
            )}
            {updatedSlot.metadata.type === "bldg" && (
              <p className="text-sm text-gray-400 w-full flex justify-between">
                <strong>Name:</strong> Building
              </p>
            )}
          </div>
          {updatedSlot.metadata.type === "slot" && (
            <button
              onClick={() => setIsOpen(true)}
              className={`hover:bg-violet-400 rounded-md w-full py-2 text-sm text-white bg-violet-500 flex items-center justify-center gap-3`}
            >
              <Settings strokeWidth={1.5} />
              <span>Manage Slot</span>
            </button>
          )}

          {/* Manage Slot Modal */}
          {isOpen && (
            <Modal onClose={() => setIsOpen(false)}>
              <SlotManagement
                selectedShape={updatedSlot}
                loading={loading}
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                onUpdateSlot={refreshSlot}
              />
            </Modal>
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
