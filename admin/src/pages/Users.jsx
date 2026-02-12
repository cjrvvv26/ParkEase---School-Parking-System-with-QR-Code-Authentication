import { useState, useEffect } from "react";
import UserTable from "../components/tables/UserTable";
import { Link } from "react-router-dom";
import useFetch from "../hooks/useFetch";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const { loading, fetchData } = useFetch();
  useEffect(() => {
    const getUsers = async () => {
      const data = await fetchData(`/user?page=${page}&limit=10`, {
        method: "GET",
      });

      if (data) {
        setUsers(data.users);
      }
    };

    getUsers();
  }, []);

  const [showFilter, setShowFilter] = useState(false);
  return (
    <>
      {/* Header Page */}
      <header className="flex justify-between px-5 pt-5 items-center">
        <div className="flex flex-col">
          <h1 className="font-bold text-3xl">User Management</h1>
          <p className="text-gray-400">
            Manage and view all users registered in the system
          </p>
        </div>
        {/* Quick Actions */}
        <div className="flex gap-5">
          <Link
            to="/add-faculty"
            className="p-4 bg-violet-500 duration-200 hover:shadow-md hover:shadow-violet-500/40 text-white flex items-center gap-2 rounded-full font-medium"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>
            <p>Add Faculty</p>
          </Link>
          <Link
            to="/add-student"
            className="p-4 bg-violet-500 duration-200 hover:shadow-md hover:shadow-violet-500/40 text-white flex items-center gap-2 rounded-full font-medium"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>
            <p>Add Student</p>
          </Link>
          <Link
            to="/add-guard"
            className="p-4 border bg-transparent border-violet-500 text-violet-500 flex items-center gap-2 rounded-full font-medium"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z"
              />
            </svg>
            <p>Add Guard</p>
          </Link>
          {/* Filter btn */}
          <div className="relative flex items-center justify-center">
            <button onClick={() => setShowFilter(!showFilter)}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6 text-gray-400"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75"
                />
              </svg>
            </button>
            {/* Filter Float Dialog */}
            {showFilter && (
              <div className="absolute top-12 right-0 bg-white rounded-lg border border-gray-200 p-5 flex flex-col gap-3 text-xs">
                <div className="flex justify-between items-center">
                  <h2 className="text-sm font-medium">Filter by</h2>
                  <button className="rounded-lg py-1 px-4 border border-violet-500 hover:bg-violet-500 hover:text-white duration-100 hover:shadow-sm hover:shadow-violet-500 bg-transparent text-violet-500">
                    Reset
                  </button>
                </div>
                {/* Filters */}
                <div className="flex flex-col gap-3">
                  <div className="flex flex-col gap-1">
                    <p className="text-xs text-gray-400">Role</p>
                    <div className="flex gap-2">
                      <button className="py-2 px-4 rounded-md text-gray-400 border-gray-400 border text-nowrap">
                        All
                      </button>
                      <button className="py-2 px-4 rounded-md text-gray-400 border-gray-400 border text-nowrap">
                        Student
                      </button>
                      <button className="py-2 px-4 rounded-md text-gray-400 border-gray-400 border text-nowrap">
                        Guard
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <p className="text-xs text-gray-400">Status</p>
                    <div className="flex gap-2">
                      <button className="py-2 px-4 rounded-md text-gray-400 border-gray-400 border text-nowrap">
                        Active
                      </button>
                      <button className="py-2 px-4 rounded-md text-gray-400 border-gray-400 border text-nowrap">
                        Not Active
                      </button>
                    </div>
                  </div>
                  {/* Apply btn */}
                  <button className="py-2 px-4 rounded-md hover:shadow-sm hover:shadow-violet-500 duration-100 text-white bg-violet-500">
                    Apply
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>
      {/* User Lists */}
      <div className="h-[calc(100vh-217.6px)] mb-3">
        {/* Table */}
        <table className="flex h-full flex-col mx-3 border border-gray-200 rounded-xl overflow-hidden">
          <thead className="p-5 flex flex-col gap-3 border-b border-gray-200">
            {/* Pagination Details */}
            <tr className="text-xs text-gray-400 flex gap-5 justify-between items-center w-full">
              {/* Refresh */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-5 cursor-pointer hover:text-gray-700 text-gray-400"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
                />
              </svg>

              <div className="flex gap-5">
                <p className="">20 of 302</p>
                <div className="flex gap-3 *:size-4 *:hover:text-gray-700 *:text-gray-400 *:cursor-pointer">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
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
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m8.25 4.5 7.5 7.5-7.5 7.5"
                    />
                  </svg>
                </div>
              </div>
            </tr>
            <tr className="grid grid-cols-[auto_repeat(4,minmax(0,1fr))_150px_100px] gap-5 *:font-medium">
              <td>
                <div className="h-5 w-5 rounded-md border-gray-200 border-2 bg-white"></div>
              </td>
              <td>Name</td>
              <td>Contact</td>
              <td>Last Login</td>
              <td>Created At</td>
              <td>Status</td>
              <td>Action</td>
            </tr>
          </thead>
          <tbody className="overflow-y-auto">
            {/* User List Card */}
            {users && <UserTable users={users} />}
          </tbody>
        </table>
      </div>
    </>
  );
}
