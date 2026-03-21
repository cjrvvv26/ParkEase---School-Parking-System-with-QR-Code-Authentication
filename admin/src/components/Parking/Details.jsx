import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Settings, Building2, Info } from "lucide-react";
import Modal from "../Modal";
import SlotManagement from "./SlotManagement";
import useDark from "../../hooks/useDark";

export default function Details({ selectedShape, loading }) {
  const [isOpen, setIsOpen] = useState(false);
  const [updatedSlot, setUpdatedSlot] = useState(selectedShape);
  const { dark, border } = useDark();

  useEffect(() => {
    setUpdatedSlot(selectedShape);
  }, [selectedShape]);

  const refreshSlot = (slot) => setUpdatedSlot(slot);

  const statusLabel = updatedSlot?.assignedStudentId
    ? "Exclusive"
    : updatedSlot?.occupiedBy
      ? "Occupied"
      : "Available";

  const statusColor = {
    Exclusive: "bg-violet-100 text-violet-600",
    Occupied: "bg-rose-100 text-rose-600",
    Available: "bg-green-100 text-green-600",
  };

  return (
    <section className={`w-[380px] border-l flex flex-col ${border} ${!updatedSlot ? "items-center justify-center" : ""} p-5 gap-4`}>
      {updatedSlot ? (
        <div className="flex flex-col h-full justify-between gap-4 w-full">
          <div className="flex flex-col gap-4 w-full">

            {updatedSlot.metadata?.type === "building" && (
              <div className="flex flex-col gap-3">
                {updatedSlot.metadata?.information?.picture?.url ? (
                  <img src={updatedSlot.metadata.information.picture.url} alt="Building" className={`w-full h-40 object-cover rounded-xl border ${border}`} />
                ) : (
                  <div className={`w-full h-40 rounded-xl flex flex-col items-center justify-center gap-2 text-gray-300 ${dark ? 'bg-[#3a3a3a]' : 'bg-gray-100'}`}>
                    <Building2 size={32} strokeWidth={1} />
                    <p className="text-xs">No image uploaded</p>
                  </div>
                )}
                {updatedSlot.metadata?.information?.name && (
                  <p className={`font-semibold ${dark ? 'text-gray-200' : 'text-gray-700'}`}>{updatedSlot.metadata.information.name}</p>
                )}
                {updatedSlot.metadata?.information?.description && (
                  <p className="text-xs text-gray-400 leading-relaxed">{updatedSlot.metadata.information.description}</p>
                )}
                <div className={`flex justify-between text-xs text-gray-500 border-t pt-3 ${border}`}>
                  <span className="text-gray-400">Label</span>
                  <span className={`font-medium ${dark ? 'text-gray-300' : ''}`}>{updatedSlot.metadata?.label}</span>
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span className="text-gray-400">Type</span>
                  <span className={`font-medium capitalize ${dark ? 'text-gray-300' : ''}`}>{updatedSlot.metadata?.type}</span>
                </div>
              </div>
            )}

            {/* Slot shape */}
            {updatedSlot.metadata?.type === "slot" && (
              <div className="flex flex-col gap-4">
                {/* Assigned user card */}
                {updatedSlot.assignedStudentId ? (
                  <div className="flex flex-col gap-3 p-3 bg-violet-50 rounded-xl border border-violet-100">
                    <div className="flex gap-3 items-center">
                      {updatedSlot.profileDetails?.url ? (
                        <img src={updatedSlot.profileDetails.url} alt="" className="h-12 w-12 rounded-full object-cover ring-2 ring-violet-200" />
                      ) : (
                        <div className="h-12 w-12 rounded-full bg-violet-100 flex items-center justify-center text-violet-500 font-semibold">
                          {updatedSlot.name?.firstName?.[0] || "?"}
                        </div>
                      )}
                      <div className="flex flex-col gap-0.5 overflow-hidden">
                        <p className="font-semibold text-gray-700 truncate">
                          {updatedSlot.name?.firstName} {updatedSlot.name?.middleName?.charAt(0)}. {updatedSlot.name?.lastName}
                        </p>
                        <p className="text-xs text-gray-400">{updatedSlot.studentNo}</p>
                        <div className="flex gap-1 flex-wrap mt-1">
                          <span className={`text-xs px-2 py-0.5 rounded-full ${updatedSlot.status === "active" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-500"}`}>
                            {updatedSlot.status?.charAt(0).toUpperCase() + updatedSlot.status?.slice(1)}
                          </span>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${updatedSlot.payment?.isPaid ? "bg-blue-100 text-blue-600" : "bg-red-100 text-red-500"}`}>
                            {updatedSlot.payment?.isPaid ? "Paid" : "Unpaid"}
                          </span>
                        </div>
                      </div>
                    </div>
                    {/* Motor details */}
                    {updatedSlot.motorDetails && (
                      <div className="flex flex-col gap-1 border-t border-violet-100 pt-2">
                        <p className="text-xs font-semibold text-gray-500 mb-1">Motorcycle</p>
                        {Object.entries(updatedSlot.motorDetails).slice(0, 4).map(([k, v]) => (
                          <div key={k} className="flex justify-between text-xs">
                            <span className="text-gray-400 capitalize">{k}</span>
                            <span className="text-gray-600 font-medium">{v}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    <Link to={`users/${updatedSlot._id}`} className="text-xs text-violet-500 hover:underline self-start">
                      View full profile →
                    </Link>
                  </div>
                ) : (
                  <div className={`h-28 rounded-xl border border-dashed flex flex-col items-center justify-center gap-1 text-gray-300 ${dark ? 'bg-[#3a3a3a] border-[#4a4a4a]' : 'bg-gray-50 border-gray-200'}`}>
                    <Info size={20} strokeWidth={1} />
                    <p className="text-xs">Slot is available</p>
                  </div>
                )}

                {/* Slot meta */}
                <div className="flex flex-col gap-2 text-xs">
                  <div className="flex justify-between text-gray-500">
                    <span className="text-gray-400">Label</span>
                    <span className="font-medium">{updatedSlot.metadata?.label}</span>
                  </div>
                  <div className="flex justify-between text-gray-500">
                    <span className="text-gray-400">Type</span>
                    <span className="font-medium capitalize">{updatedSlot.metadata?.type}</span>
                  </div>
                  <div className="flex justify-between text-gray-500">
                    <span className="text-gray-400">Status</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColor[statusLabel]}`}>{statusLabel}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {updatedSlot.metadata?.type === "slot" && (
            <button
              onClick={() => setIsOpen(true)}
              className="w-full py-2.5 rounded-xl bg-violet-500 hover:bg-violet-600 text-white text-sm font-medium flex items-center justify-center gap-2 transition"
            >
              <Settings size={16} strokeWidth={1.5} />
              Manage Slot
            </button>
          )}

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
        <div className="flex flex-col gap-2 items-center text-center">
          <div className={`p-3 rounded-full ${dark ? 'bg-[#3a3a3a]' : 'bg-gray-100'}`}>
            <Info size={20} className="text-gray-400" />
          </div>
          <p className={`font-medium text-sm ${dark ? 'text-gray-300' : 'text-gray-600'}`}>No shape selected</p>
          <p className="text-xs text-gray-400">Click a parking slot or building on the map to view details.</p>
        </div>
      )}
    </section>
  );
}
