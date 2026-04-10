import { useState, useEffect } from "react";
import useFetch from "../../hooks/useFetch";
import useDark from "../../hooks/useDark";
import { Search, UserCheck, UserX, AlertTriangle, X, ParkingSquare } from "lucide-react";

function Avatar({ src, name }) {
  return src ? (
    <img src={src} alt={name} className="w-10 h-10 rounded-full object-cover ring-2 ring-blue-100 flex-shrink-0" />
  ) : (
    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 font-semibold text-sm flex-shrink-0">
      {name?.[0]?.toUpperCase() || "?"}
    </div>
  );
}

function ConfirmDialog({ title, message, confirmLabel, confirmClass, onConfirm, onCancel, loading, error }) {
  const { dark, border } = useDark();
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className={`rounded-2xl shadow-2xl w-[380px] p-6 flex flex-col gap-4 ${dark ? 'bg-[#2f2f2f]' : 'bg-white'}`}>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full bg-rose-50">
            <AlertTriangle size={20} className="text-rose-500" />
          </div>
          <h2 className={`font-semibold ${dark ? 'text-gray-200' : 'text-gray-800'}`}>{title}</h2>
        </div>
        <p className="text-sm text-gray-500">{message}</p>
        {error && <p className="text-xs text-rose-500">{error}</p>}
        <div className="flex gap-3 mt-1">
          <button onClick={onCancel} className={`flex-1 py-2 rounded-xl border text-sm transition ${dark ? 'border-[#4a4a4a] text-gray-400 hover:bg-[#3a3a3a]' : 'border-gray-200 text-gray-500 hover:bg-gray-50'}`}>Cancel</button>
          <button onClick={onConfirm} disabled={loading} className={`flex-1 py-2 rounded-xl text-sm text-white transition ${confirmClass} disabled:opacity-60`}>{loading ? "Processing..." : confirmLabel}</button>
        </div>
      </div>
    </div>
  );
}

export default function SlotManagement({ selectedShape, onUpdateSlot, setIsOpen }) {
  const [assignedUser, setAssignedUser] = useState(null);
  const [availableUsers, setAvailableUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [confirm, setConfirm] = useState(null);
  const { fetchData, loading, error } = useFetch();
  const { dark, border, input } = useDark();

  useEffect(() => {
    const getUsers = async () => {
      const res = await fetchData("/user/available", {
        method: "POST",
        data: { id: selectedShape._id },
      });
      if (res?.assignedUser) setAssignedUser(res.assignedUser);
      setAvailableUsers(res?.users || []);
    };
    getUsers();
  }, []);

  const handleRemove = async () => {
    const res = await fetchData("slot/remove", {
      method: "POST",
      data: { id: selectedShape._id },
    });
    if (res) {
      setIsOpen(false);
      onUpdateSlot(res.slot);
    }
  };

  const handleAssign = async (user) => {
    const res = await fetchData("/slot/assign", {
      method: "POST",
      data: { student: user, slot: selectedShape },
    });
    if (res) {
      setIsOpen(false);
      onUpdateSlot(res.slot);
    }
  };

  const filtered = availableUsers.filter((u) => {
    if (!u) return false;
    const firstName = u.profile?.name?.firstName || u.name?.firstName || "";
    const lastName = u.profile?.name?.lastName || u.name?.lastName || "";
    const name = `${firstName} ${lastName}`.toLowerCase();
    return name.includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase());
  });

  const slotLabel = selectedShape?.metadata?.label || "Slot";
  const slotStatus = selectedShape?.assignedStudentId ? "Exclusive" : selectedShape?.occupiedBy ? "Occupied" : "Available";
  const statusColor = { Exclusive: "bg-blue-100 text-blue-600", Occupied: "bg-rose-100 text-rose-600", Available: "bg-green-100 text-green-600" };

  return (
    <div className="flex flex-col w-[620px] gap-0 text-sm select-none">
      {/* Header */}
      <div className={`flex items-center justify-between px-6 pt-6 pb-4 border-b ${border}`}>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-blue-50">
            <ParkingSquare size={20} className="text-blue-500" />
          </div>
          <div>
            <h1 className={`font-semibold text-base ${dark ? 'text-gray-200' : 'text-gray-800'}`}>Manage Slot</h1>
            <p className="text-xs text-gray-400">Slot {slotLabel}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-xs font-medium px-3 py-1 rounded-full ${statusColor[slotStatus]}`}>{slotStatus}</span>
          <button onClick={() => setIsOpen(false)} className={`p-1.5 rounded-lg text-gray-400 transition ${dark ? 'hover:bg-[#3a3a3a]' : 'hover:bg-gray-100'}`}>
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Assigned User */}
      <div className={`px-6 py-4 border-b ${border}`}>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Assigned User</p>
        {assignedUser ? (
          <div className={`flex items-center justify-between rounded-xl p-3 border ${dark ? 'bg-[#3a3a3a] border-[#4a4a4a]' : 'bg-blue-50 border-blue-100'}`}>
            <div className="flex items-center gap-3">
              <Avatar src={assignedUser.profileDetails?.url} name={assignedUser.name?.firstName} />
              <div>
                <p className={`font-medium ${dark ? 'text-gray-200' : 'text-gray-800'}`}>{assignedUser.name?.firstName} {assignedUser.name?.lastName}</p>
                <p className="text-xs text-gray-400">{assignedUser.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-xs border px-2 py-1 rounded-lg capitalize ${dark ? 'bg-[#2f2f2f] border-[#4a4a4a] text-blue-400' : 'bg-white border-blue-200 text-blue-500'}`}>{assignedUser.role}</span>
              <button onClick={() => setConfirm({ type: "remove" })} className="flex items-center gap-1.5 text-xs bg-rose-500 hover:bg-rose-600 text-white px-3 py-1.5 rounded-lg transition">
                <UserX size={13} /> Remove
              </button>
            </div>
          </div>
        ) : (
          <div className={`flex items-center gap-3 rounded-xl p-3 border border-dashed ${dark ? 'bg-[#3a3a3a] border-[#4a4a4a]' : 'bg-gray-50 border-gray-200'}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${dark ? 'bg-[#2f2f2f]' : 'bg-gray-100'}`}>
              <UserX size={16} className="text-gray-300" />
            </div>
            <p className="text-gray-400 text-xs">No user assigned to this slot</p>
          </div>
        )}
      </div>

      {/* Available Users */}
      <div className="px-6 py-4 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Available Users</p>
          <span className="text-xs text-gray-400">{filtered.length} users</span>
        </div>
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`w-full pl-9 pr-4 py-2 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-300 transition ${input}`}
          />
        </div>
        <div className="flex flex-col max-h-[280px] overflow-y-auto gap-1 pr-1">
          {filtered.length === 0 ? (
            <div className="py-8 text-center text-gray-400 text-xs">No available users found</div>
          ) : (
            filtered.map((user, i) => {
              const firstName = user.profile?.name?.firstName || user.name?.firstName || "";
              const lastName = user.profile?.name?.lastName || user.name?.lastName || "";
              return (
              <div key={i} className={`flex items-center justify-between p-3 rounded-xl border border-transparent transition group ${dark ? 'hover:bg-[#3a3a3a] hover:border-[#4a4a4a]' : 'hover:bg-gray-50 hover:border-gray-100'}`}>
                <div className="flex items-center gap-3">
                  <Avatar src={user.profileDetails?.url} name={firstName} />
                  <div>
                    <p className={`font-medium ${dark ? 'text-gray-200' : 'text-gray-700'}`}>{firstName} {lastName}</p>
                    <p className="text-xs text-gray-400">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-1 rounded-lg capitalize ${dark ? 'bg-[#2f2f2f] text-gray-400' : 'bg-gray-100 text-gray-400'}`}>{user.role}</span>
                  <button
                    onClick={() => setConfirm({ type: "assign", user, firstName, lastName })}
                    className="flex items-center gap-1.5 text-xs bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded-lg transition opacity-0 group-hover:opacity-100"
                  >
                    <UserCheck size={13} /> Assign
                  </button>
                </div>
              </div>
              );
            })
          )}
        </div>
      </div>

      {/* Confirm dialogs */}
      {confirm?.type === "remove" && (
        <ConfirmDialog
          title="Remove Assignment"
          message={`Remove ${assignedUser?.name?.firstName} ${assignedUser?.name?.lastName} from Slot ${slotLabel}?`}
          confirmLabel="Yes, Remove"
          confirmClass="bg-rose-500 hover:bg-rose-600"
          onConfirm={handleRemove}
          onCancel={() => setConfirm(null)}
          loading={loading}
          error={error}
        />
      )}
      {confirm?.type === "assign" && (
        <ConfirmDialog
          title="Assign User"
          message={`Assign ${confirm.firstName} ${confirm.lastName} to Slot ${slotLabel}?`}
          confirmLabel="Yes, Assign"
          confirmClass="bg-blue-500 hover:bg-blue-600"
          onConfirm={() => handleAssign(confirm.user)}
          onCancel={() => setConfirm(null)}
          loading={loading}
          error={error}
        />
      )}
    </div>
  );
}
