import { useState, useEffect } from "react";
import useFetch from "../../hooks/useFetch";
import {
  Search,
  Funnel,
  ChevronLeft,
  ChevronRight,
  CircleAlert,
} from "lucide-react";
import Modal from "../Modal";

export default function SlotManagement({
  selectedShape,
  loading,
  onUpdateSlot,
  setIsOpen,
}) {
  const [openConfirmation, setOpenConfirmation] = useState(false);
  const [assignedUser, setAssignedUser] = useState(null);
  const [availableUsers, setAvailableUsers] = useState([]);
  const { fetchData, error } = useFetch();

  useEffect(() => {
    const getUsers = async () => {
      const res = await fetchData("/user/available", {
        method: "POST",
        data: { id: selectedShape._id },
      });
      console.log(res);

      if (res.assignedUser) {
        setAssignedUser({ ...res?.assignedUser });
      }
      setAvailableUsers(res.users);
    };

    getUsers();
  }, []);

  const handleRemoveUser = async (shape) => {
    console.log(shape._id);

    const res = await fetchData("slot/remove", {
      method: "POST",
      data: { id: shape._id },
    });
    console.log(res);

    if (res) {
      setIsOpen(false);
      setOpenConfirmation(false);
      onUpdateSlot(res.slot);
    }
  };

  const handleAssignUser = async (slot, user) => {
    const res = await fetchData("/slot/assign", {
      method: "POST",
      data: { student: user, slot },
    });
    console.log(res);

    if (res) {
      setIsOpen(false);
      setOpenConfirmation(false);
      onUpdateSlot(res.slot);
    }
  };

  return (
    <div className="flex select-none min-w-[600px] flex-col text-sm gap-5">
      <div className="flex justify-between items-center">
        <h1 className="text-base font-medium">Slot Management</h1>
        {/* Pagination */}
        <div className="flex items-center gap-3 text-xs text-gray-400">
          <p>15 of 500</p>
          <ChevronLeft size={20} strokeWidth={1.5} className="cursor-pointer" />
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
        {assignedUser ? (
          <div className="flex items-center justify-between border-b border-gray-200">
            <div className="flex items-center gap-3 p-1  w-full">
              <img
                src={assignedUser.profileDetails.url}
                alt=""
                className="object-cover h-10 w-10 rounded-full"
              />
              <p className="truncate w-[200px]">
                {assignedUser.name.firstName + " " + assignedUser.name.lastName}
              </p>
              <p className="text-gray-400 truncate w-[200px]">
                {assignedUser.email}
              </p>
            </div>
            <div className="flex gap-3">
              <p className="h-full text-gray-400 rounded-md bg-gray-100 py-2 px-4">
                {assignedUser.role.charAt(0).toUpperCase() +
                  assignedUser.role.slice(1)}
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
                      <h1 className="text-gray-700">
                        Slot Removal Confirmation
                      </h1>
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
                    {error && (
                      <p className="text-xs w-[300px] truncate text-red-500">
                        {error}
                      </p>
                    )}
                  </div>
                </Modal>
              )}
            </div>
          </div>
        ) : (
          <p className="py-4 h-24 border-b border-gray-200 w-full text-center text-gray-400">
            No Assigned User
          </p>
        )}
        {availableUsers.map((user, index) => (
          <div
            key={index}
            className="flex items-center justify-between border-b border-gray-200"
          >
            <div className="flex items-center gap-3 p-1  w-full">
              <img
                src={user.profileDetails.url}
                alt={user.profileDetails.url}
                className="object-cover h-10 w-10 rounded-full"
              />
              <p className="truncate w-[200px]">
                {user.profile.name.firstName + " " + user.profile.name.lastName}
              </p>
              <p className="text-gray-400 truncate w-[200px]">{user.email}</p>
            </div>
            <div className="flex gap-3">
              <p className="h-full text-gray-400 rounded-md bg-gray-100 py-2 px-4">
                {user.role}
              </p>
              <button
                onClick={() => {
                  setOpenConfirmation(true);
                }}
                className="bg-violet-500 hover:bg-violet-400 text-white px-4 py-2 rounded-md"
              >
                Assign
              </button>
              {openConfirmation && (
                <Modal onClose={() => setOpenConfirmation(false)}>
                  <header className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-violet-500 font-medium">
                      <CircleAlert size={20} />
                      <h1 className="text-gray-700">
                        Slot Assignment Confirmation
                      </h1>
                    </div>
                  </header>
                  <p className="text-sm text-gray-400 mt-5">
                    Are you sure you want to assign this user?
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
                      onClick={() => handleAssignUser(selectedShape, user)}
                      className={`${loading ? "bg-gray-500 hover:gray-400" : "hover:bg-violet-400 bg-violet-500"} py-2  w-full rounded-md  text-white`}
                    >
                      {loading ? "Processing..." : "Yes, I'm sure"}
                    </button>
                    {error && (
                      <p className="text-xs w-[50] truncate text-red-500">
                        {error}
                      </p>
                    )}
                  </div>
                </Modal>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
