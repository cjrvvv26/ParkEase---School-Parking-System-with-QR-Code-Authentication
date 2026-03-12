import { useState, useEffect } from 'react';
import UserTable from '../components/tables/UserTable';
import { Link } from 'react-router-dom';
import useFetch from '../hooks/useFetch';
import { RefreshCcw } from 'lucide-react';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [count, setCount] = useState({ current: 0, total: 0 });
  const [filter, setFilter] = useState({ role: 'all', status: 'all' });
  const { loading, fetchData } = useFetch();

  const getUsers = async () => {
    const data = await fetchData(
      `/user?page=${page}&limit=10&role=${filter.role}&status=${filter.status}`,
      {
        method: 'GET',
      },
    );

    if (data) {
      setUsers(data.users);
      console.log(data.users);

      setCount({ current: data.current, total: data.total });
    }
  };

  useEffect(() => {
    getUsers();
  }, [page, filter]);

  const [showFilter, setShowFilter] = useState(false);
  return (
    <>
      {/* Header Page */}
      <header className='flex justify-between px-5 pt-5 items-center'>
        <div className='flex flex-col'>
          <h1 className='font-bold text-3xl'>User Management</h1>
          <p className='text-gray-400'>
            Manage and view all users registered in the system
          </p>
        </div>
        {/* Quick Actions */}
        <div className='flex gap-5'>
          <Link
            to='/add-faculty'
            className='p-4 bg-violet-500 duration-200 hover:shadow-md hover:shadow-violet-500/40 text-white flex items-center gap-2 rounded-full font-medium'
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              strokeWidth={1.5}
              stroke='currentColor'
              className='size-6'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z'
              />
            </svg>
            <p>Add Faculty</p>
          </Link>
          <Link
            to='/add-student'
            className='p-4 bg-violet-500 duration-200 hover:shadow-md hover:shadow-violet-500/40 text-white flex items-center gap-2 rounded-full font-medium'
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              strokeWidth={1.5}
              stroke='currentColor'
              className='size-6'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z'
              />
            </svg>
            <p>Add Student</p>
          </Link>
          <Link
            to='/add-guard'
            className='p-4 border bg-transparent border-violet-500 text-violet-500 flex items-center gap-2 rounded-full font-medium'
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              strokeWidth={1.5}
              stroke='currentColor'
              className='size-6'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z'
              />
            </svg>
            <p>Add Guard</p>
          </Link>
          {/* Filter btn */}
          <div className='relative flex items-center justify-center'>
            <button onClick={() => setShowFilter(!showFilter)}>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth={1.5}
                stroke='currentColor'
                className='size-6 text-gray-400'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75'
                />
              </svg>
            </button>
            {/* Filter Float Dialog */}
            {showFilter && (
              <div className='absolute top-12 right-0 bg-white rounded-lg border border-gray-200 p-5 flex flex-col gap-3 text-xs'>
                <div className='flex justify-between items-center'>
                  <h2 className='text-sm font-medium'>Filter by</h2>
                  <button
                    onClick={() =>
                      setFilter(() => ({ role: 'all', status: 'all' }))
                    }
                    className='text-gray-400 hover:text-gray-500 bg-transparent'
                  >
                    Reset
                  </button>
                </div>
                {/* Filters */}
                <div className='flex flex-col gap-3'>
                  <div className='flex flex-col gap-1'>
                    <p className='text-xs text-gray-400'>Role</p>
                    <div className='flex gap-2'>
                      {['All', 'Student', 'Faculty', 'Guard'].map(
                        (role, index) => (
                          <button
                            onClick={() =>
                              setFilter((prev) => ({
                                ...prev,
                                role: role.toLowerCase(),
                              }))
                            }
                            key={index}
                            className={`${role.toLowerCase() === filter.role ? 'bg-violet-500 hover:bg-violet-400 text-white' : 'text-violet-500 bg-violet-100 border-violet-500 hover:bg-violet-500  hover:text-white'} py-2 px-4 rounded-md  border text-nowrap`}
                          >
                            {role}
                          </button>
                        ),
                      )}
                    </div>
                  </div>
                  <div className='flex flex-col gap-1'>
                    <p className='text-xs text-gray-400'>Status</p>
                    <div className='flex gap-2'>
                      {['Active', 'Deactivate', 'Offline'].map((status) => (
                        <button
                          key={status}
                          onClick={() =>
                            setFilter((prev) => ({
                              ...prev,
                              status: status.toLowerCase(),
                            }))
                          }
                          className={`${status.toLowerCase() === filter.status ? 'bg-violet-500 hover:bg-violet-400 text-white' : 'text-violet-500 bg-violet-100 border-violet-500 hover:bg-violet-500  hover:text-white'} py-2 px-4 rounded-md  border text-nowrap`}
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>
      {/* User Lists */}
      <div className='h-[calc(100vh-217.6px)] mb-3'>
        {/* Table */}
        <table className='flex h-full flex-col mx-3 border border-gray-200 rounded-xl overflow-hidden'>
          <thead className='p-5 flex flex-col gap-3 border-b border-gray-200'>
            {/* Pagination Details */}
            <tr className='text-xs text-gray-400 flex gap-5 justify-between items-center w-full'>
              {/* Refresh */}
              <RefreshCcw
                onClick={getUsers}
                className='text-gray-400 cursor-pointer hover:text-gray-500 size-5'
                strokeWidth={1.5}
              />
              <div className='flex gap-5'>
                <p className=''>
                  {count.current} of {count.total}
                </p>
                <div className='flex gap-3 *:size-4 *:hover:text-gray-700 *:text-gray-400 *:cursor-pointer'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth={1.5}
                    stroke='currentColor'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      d='M15.75 19.5 8.25 12l7.5-7.5'
                    />
                  </svg>

                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth={1.5}
                    stroke='currentColor'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      d='m8.25 4.5 7.5 7.5-7.5 7.5'
                    />
                  </svg>
                </div>
              </div>
            </tr>
            <tr className='grid grid-cols-[250px_repeat(3,minmax(0,1fr))_150px_100px] gap-5 *:font-medium'>
              <td>Name</td>
              <td>Contact</td>
              <td>Last Login</td>
              <td>Created At</td>
              <td>Status</td>
              <td>Action</td>
            </tr>
          </thead>
          <tbody className='overflow-y-auto'>
            {/* User List Card */}
            {users ? (
              <UserTable users={users} />
            ) : (
              Array.from({ length: 4 }, (_, i) => (
                <tr
                  key={i}
                  className='grid grid-cols-[250px_repeat(3,minmax(0,1fr))_150px_100px] gap-5 px-5 py-4 items-center *:animate-pulse text-gray-400'
                >
                  <div className='flex gap-2 items-center'>
                    <span className='min-h-12 min-w-12 rounded-full bg-gray-100'></span>
                    <div className='flex flex-col w-full gap-1'>
                      <span className='py-2 rounded-full bg-gray-100 h-1 '></span>
                      <span className='py-2 rounded-full bg-gray-100 w-[70%] h-1 '></span>
                    </div>
                  </div>
                  {Array.from({ length: 4 }, (_, i) => (
                    <span
                      key={i}
                      className='py-2 rounded-full bg-gray-100 w-[70%] h-1 '
                    ></span>
                  ))}
                  <span className='py-4 rounded-md bg-gray-100 w-10 h-1 '></span>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
