import { useState } from "react";
import useFetch from "../../hooks/useFetch";
import { Link } from "react-router-dom";
import {
  Settings,
  Search,
  Funnel,
  FunnelX,
  X,
  ChevronLeft,
  ChevronRight,
  CircleAlert,
} from "lucide-react";
import Modal from "../Modal";

export default function Details({ selectedShape, loading }) {
  const [isOpen, setIsOpen] = useState(false);
  const [openConfirmation, setOpenConfirmation] = useState(false);
  const { fetchData } = useFetch();

  const handleRemoveUser = async (shape) => {
    console.log(shape._id);

    const res = await fetchData("slot/remove", {
      method: "POST",
      data: { id: shape._id },
    });

    if (res) {
      setIsOpen(false);
      setOpenConfirmation(false);
    }
  };

  return (
    <section
      className={`${!selectedShape && "justify-center"} w-[400px] border-l border-gray-200 flex flex-col p-5 items-center gap-1`}
    >
      {selectedShape ? (
        <div className="flex flex-col items-center h-full justify-between gap-4 w-full">
          <div className="text-left w-full">
            {selectedShape.metadata?.type === "slot" &&
            selectedShape.assignedStudentId ? (
              <div className="flex flex-col mb-5 gap-5">
                {/* Profile Details */}
                <div className="flex gap-3 items-center border-b pb-2 border-gray-200">
                  <img
                    src={selectedShape.profileDetails?.url}
                    alt={selectedShape.profileDetails?.url}
                    className="h-32 w-32 ring-1 ring-gray-200 rounded-md"
                  />
                  <div className="flex flex-col gap-5 overflow-hidden w-full">
                    <div className="flex flex-col gap-1">
                      <p className="text-gray-600 font-medium w-full truncate">
                        {selectedShape.name.firstName +
                          " " +
                          selectedShape.name.middleName.charAt(0) +
                          ". " +
                          selectedShape.name.lastName}
                      </p>
                      <p className="text-gray-400">{selectedShape.studentNo}</p>
                      <p className="text-gray-400">
                        {selectedShape.yearLevel + " - " + selectedShape.course}
                      </p>
                      <div className="flex gap-1">
                        <p
                          className={`${selectedShape.status === "active" ? "text-green-500 bg-green-100" : "text-red-500 bg-red-100"} text-xs py-1 px-2 rounded-sm self-start`}
                        >
                          {selectedShape.status.charAt(0).toUpperCase() +
                            selectedShape.status.slice(1)}
                        </p>
                        <p
                          className={`${selectedShape.payment.isPaid ? "text-blue-500 bg-blue-100" : "text-red-500 bg-red-100"} text-xs py-1 px-2 rounded-sm self-start`}
                        >
                          {selectedShape.payment.isPaid ? "Paid" : "Not Paid"}
                        </p>
                        <p
                          className={`${selectedShape.userId === selectedShape.assignedStudentId ? "text-orange-500 bg-orange-100" : "text-red-500 bg-red-100"} text-xs py-1 px-2 rounded-sm self-start`}
                        >
                          {selectedShape.userId ===
                          selectedShape.assignedStudentId
                            ? "In-Slot"
                            : "Valid Parking"}
                        </p>
                      </div>
                    </div>
                    <Link
                      to={`users/${selectedShape._id}`}
                      className="hover:underline text-gray-400 hover:text-violet-500 text-xs"
                    >
                      View
                    </Link>
                  </div>
                </div>
                {/* Motorcycle Details */}
                <div className="flex flex-col gap-3 border-b border-gray-200 pb-2">
                  <h2 className="font-medium text-base">Motorcycle Details</h2>
                  {Object.entries(selectedShape.motorDetails)
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
              {selectedShape.metadata.label.charAt(0).toUpperCase() +
                selectedShape.metadata.label.slice(1)}
            </p>
            <p className="text-sm text-gray-600 w-full flex justify-between">
              <span className="text-gray-400">Type:</span>{" "}
              {selectedShape.metadata.type.charAt(0).toUpperCase() +
                selectedShape.metadata.type.slice(1)}
            </p>
            {selectedShape.metadata.type === "slot" && (
              <p className="text-sm text-gray-600 w-full flex justify-between">
                <span className="text-gray-400">Status: </span>
                {selectedShape.assignedStudentId
                  ? "Exclusive"
                  : selectedShape.occupiedBy
                    ? "Occupied"
                    : "Available"}
              </p>
            )}
            {selectedShape.metadata.type === "bldg" && (
              <p className="text-sm text-gray-400 w-full flex justify-between">
                <strong>Name:</strong> Building
              </p>
            )}
          </div>
          {selectedShape.metadata.type === "slot" && (
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
              <div className="flex select-none min-w-[600px] flex-col text-sm gap-5">
                <div className="flex justify-between items-center">
                  <h1 className="text-base font-medium">Slot Management</h1>
                  {/* Pagination */}
                  <div className="flex items-center gap-3 text-xs text-gray-400">
                    <p>15 of 500</p>
                    <ChevronLeft
                      size={20}
                      strokeWidth={1.5}
                      className="cursor-pointer"
                    />
                    <ChevronRight
                      size={20}
                      strokeWidth={1.5}
                      className="cursor-pointer"
                    />
                  </div>
                </div>
                <header className="flex items-center justify-between gap-5">
                  {/* Search Bar */}
                  <div className="relative min-w-[500px] bg-gray-50 overflow-hidden rounded-full">
                    <button className="rounded-full left-1 absolute -translate-y-1/2 top-1/2 h-10 w-10 bg-gradient-to-tr flex items-center justify-center from-violet-300 to-violet-500 text-white">
                      <Search size={20} strokeWidth={1.5} />
                    </button>
                    <input
                      type="text"
                      placeholder="Search name"
                      className="outline-none text-gray-600 w-full bg-gray-100 pl-14 pr-4 h-12"
                    />
                  </div>
                  {/* Filter */}
                  <Funnel
                    strokeWidth={1.5}
                    size={20}
                    className="text-gray-400 hover:cursor-pointer"
                  />
                </header>

                {/* List of users */}
                <div className="flex flex-col max-h-[400px] overflow-y-auto w-full border-t border-gray-200">
                  <div className="flex items-center justify-between border-b border-gray-200">
                    <div className="flex items-center gap-3 p-1  w-full">
                      <img
                        src="https://plus.unsplash.com/premium_photo-1690407617542-2f210cf20d7e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cGVyc29ufGVufDB8fDB8fHww"
                        alt=""
                        className="object-cover h-10 w-10 rounded-full"
                      />
                      <p className="truncate">Clarence Valle</p>
                      <p className="text-gray-400 truncate">
                        example@gmail.com
                      </p>
                    </div>
                    <div className="flex gap-3">
                      <p className="h-full text-gray-400 rounded-md bg-gray-100 py-2 px-4">
                        Student
                      </p>
                      <button
                        onClick={() => {
                          setOpenConfirmation(true);
                        }}
                        className="bg-rose-500 hover:bg-rose-400 text-white px-4 py-2 rounded-md"
                      >
                        Remove
                      </button>
                      {openConfirmation && (
                        <Modal onClose={() => setOpenConfirmation(false)}>
                          <header className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-rose-500 font-medium">
                              <CircleAlert size={20} />
                              <h1 className="">Slot Removal Confirmation</h1>
                            </div>
                          </header>
                          <p className="text-sm text-gray-400 mt-5">
                            Are you sure you want to remove this user?
                          </p>
                          <div className="flex text-sm flex-col gap-3 mt-5">
                            <button
                              onClick={() => setOpenConfirmation(false)}
                              className="py-2 w-full rounded-md border border-gray-200 hover:text-gray-500 text-gray-400"
                            >
                              Cancel
                            </button>
                            <button
                              disabled={loading}
                              onClick={() => handleRemoveUser(selectedShape)}
                              className={`${loading ? "bg-gray-500 hover:gray-400" : "hover:bg-rose-400 bg-rose-500"} py-2  w-full rounded-md  text-white`}
                            >
                              {loading ? "Processing..." : "Yes, I'm sure"}
                            </button>
                          </div>
                        </Modal>
                      )}
                    </div>
                  </div>
                </div>
              </div>
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
