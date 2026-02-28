import { useState, useEffect } from "react";
import { ClipboardList, ParkingCircle, Settings, Users } from "lucide-react";
import useFetch from "../hooks/useFetch";

export default function Logs() {
  const filterList = [
    {
      icon: <ClipboardList strokeWidth={1.5} size={20} />,
      label: "All",
    },
    {
      icon: <Users strokeWidth={1.5} size={20} />,
      label: "Users",
    },
    {
      icon: <ParkingCircle strokeWidth={1.5} size={20} />,
      label: "Parking",
    },
    {
      icon: <Settings strokeWidth={1.5} size={20} />,
      label: "System",
    },
  ];
  const { fetchData, loading, error } = useFetch();
  const [activeIndex, setActiveIndex] = useState(0);
  const [actionType, setActionType] = useState("all");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [logs, setLogs] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const getLogs = async () => {
      const data = await fetchData(
        `/activity?page=${page}&limit=${limit}&actionType=${actionType}`,
      );
      console.log(data);
      setLogs(data.logs);
      setTotal(data.total);
    };
    getLogs();
  }, [actionType, page]);

  return (
    <>
      {/* Header Page */}
      <div className="flex justify-between items-center pt-5 px-5">
        <div className="flex flex-col">
          <h1 className="font-bold text-3xl">Activity Logs</h1>
          <p className="text-gray-400">
            See every activity occurring within the system
          </p>
        </div>
        <div className="flex gap-5 items-center text-gray-400">
          <p className="text-sm">
            {logs.length > 0 ? (page - 1) * limit + 1 : 0} -{" "}
            {(page - 1) * limit + logs.length} of {total}
          </p>
          {/* Pagination */}
          <div className="flex gap-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-4 cursor-pointer hover:text-gray-700"
              onClick={() => {
                if (page > 1) setPage((prev) => prev - 1);
              }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 19.5 8.25 12l7.5-7.5"
              />
            </svg>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-4  cursor-pointer hover:text-gray-700"
              onClick={() => {
                if ((page - 1) * limit + logs.length !== total)
                  setPage((prev) => prev + 1);
              }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m8.25 4.5 7.5 7.5-7.5 7.5"
              />
            </svg>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        {/* Table Header Filters */}
        <div className="border-gray-200 border-b-2 px-5 gap-3 grid grid-cols-[230px_230px_230px_230px] place-items-center">
          {filterList.map((header, index) => (
            <button
              key={index}
              onClick={() => {
                setActiveIndex(index);
                setActionType(header.label.toLowerCase());
              }}
              className={`${
                activeIndex === index
                  ? "before:content-[''] before:absolute before:w-full before:-bottom-[1.5px] before:rounded-ss-md before:rounded-se-md before:border-b-4 before:border-violet-500 text-violet-500"
                  : ""
              } flex gap-3 items-center py-2 justify-center hover:bg-violet-100 w-full rounded-ss-xl rounded-se-xl hover:text-violet-500 relative cursor-pointer z-0`}
            >
              {header.icon}
              <p>{header.label}</p>
            </button>
          ))}
        </div>

        {loading && (
          <div className="flex-1 flex items-center justify-center">
            <div className="border-2 border-t-violet-500 border-violet-100 h-12 w-12 rounded-full animate-spin"></div>
          </div>
        )}

        {error && <p className="text-center mt-36 text-gray-700">{error}</p>}

        {logs.length < 1 && (
          <p className="text-center mt-36 text-gray-700">No records found</p>
        )}

        {/* Table Row */}
        {logs &&
          logs.map((log, _) => (
            <div
              key={log._id}
              className="py-4 px-2 hover:bg-gray-100 w-full grid grid-cols-[230px_2fr_auto] gap-3"
            >
              {/* Who did action */}
              <div className="flex gap-3 items-center">
                <img
                  src={log.userId?.profileDetails?.url}
                  alt=""
                  className="h-12 w-12 object-cover rounded-full"
                />
                <p className="font-medium text-sm overflow-hidden text-nowrap w-[120px]">
                  {log.userFullName}
                </p>
              </div>
              {/* Message */}
              <div className="flex items-center text-left overflow-hidden">
                <p className="truncate text-gray-700">{log.description}</p>
              </div>
              {/* Timestamps */}
              <p className=" items-center flex justify-center text-xs font-medium">
                {new Date(log.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
      </div>
    </>
  );
}
