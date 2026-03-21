import { useState, useEffect } from 'react';
import UserTable from '../components/tables/UserTable';
import { Link } from 'react-router-dom';
import useFetch from '../hooks/useFetch';
import { RefreshCcw, UserStar } from 'lucide-react';
import useDark from '../hooks/useDark';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [count, setCount] = useState({ current: 0, total: 0 });
  const [filter, setFilter] = useState({ role: 'all', status: 'all' });
  const [showFilter, setShowFilter] = useState(false);
  const { error, setError, loading, fetchData } = useFetch();
  const { dark, card, cardInner, border } = useDark();

  const getUsers = async () => {
    const data = await fetchData(`/user?page=${page}&limit=10&role=${filter.role}&status=${filter.status}`, { method: 'GET' });
    if (data.message === 'Successfully fetched users data') {
      setUsers(data.users);
      setCount({ current: data.current, total: data.total });
      return;
    }
    setError(data.error);
    setUsers(null);
  };

  useEffect(() => { getUsers(); }, [page, filter]);

  return (
    <>
      <header className='flex justify-between px-5 pt-5 items-center'>
        <div className='flex flex-col'>
          <h1 className='font-bold text-3xl'>User Management</h1>
          <p className='text-gray-400'>Manage and view all users registered in the system</p>
        </div>
        <div className='flex gap-5 items-center'>
          <Link to='/add-student' className='p-4 bg-violet-500 hover:bg-violet-600 text-white flex items-center gap-2 rounded-full font-medium'>
            <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={1.5} stroke='currentColor' className='size-5'>
              <path strokeLinecap='round' strokeLinejoin='round' d='M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z' />
            </svg>
            <p>Add Student</p>
          </Link>
          <Link to='/add-faculty' className='p-4 bg-violet-500 hover:bg-violet-600 text-white flex items-center gap-2 rounded-full font-medium'>
            <UserStar strokeWidth={1.5} />
            <p>Add Faculty</p>
          </Link>
          <Link to='/add-guard' className='p-4 bg-violet-500 hover:bg-violet-600 text-white flex items-center gap-2 rounded-full font-medium'>
            <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={1.5} stroke='currentColor' className='size-5'>
              <path strokeLinecap='round' strokeLinejoin='round' d='M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z' />
            </svg>
            <p>Add Guard</p>
          </Link>
          <div className='relative flex items-center justify-center'>
            <button onClick={() => setShowFilter(!showFilter)}>
              <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={1.5} stroke='currentColor' className='size-6 text-gray-400'>
                <path strokeLinecap='round' strokeLinejoin='round' d='M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75' />
              </svg>
            </button>
            {showFilter && (
              <div className={`absolute z-10 top-12 right-0 rounded-lg border ${border} p-5 flex flex-col gap-3 text-xs ${dark ? 'bg-[#2f2f2f]' : 'bg-white'}`}>
                <div className='flex justify-between items-center'>
                  <h2 className='text-sm font-medium'>Filter by</h2>
                  <button onClick={() => setFilter({ role: 'all', status: 'all' })} className='text-gray-400 hover:text-gray-500 bg-transparent'>Reset</button>
                </div>
                <div className='flex flex-col gap-3'>
                  <div className='flex flex-col gap-1'>
                    <p className='text-xs text-gray-400'>Role</p>
                    <div className='flex gap-2'>
                      {['All', 'Student', 'Faculty', 'Guard'].map((role, i) => (
                        <button key={i} onClick={() => setFilter((p) => ({ ...p, role: role.toLowerCase() }))}
                          className={`${role.toLowerCase() === filter.role ? 'bg-violet-500 text-white' : 'text-violet-500 bg-violet-100 border-violet-500 hover:bg-violet-500 hover:text-white'} py-2 px-4 rounded-md border text-nowrap`}>
                          {role}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className='flex flex-col gap-1'>
                    <p className='text-xs text-gray-400'>Status</p>
                    <div className='flex gap-2'>
                      {['Active', 'Deactivate', 'Offline'].map((status) => (
                        <button key={status} onClick={() => setFilter((p) => ({ ...p, status: status.toLowerCase() }))}
                          className={`${status.toLowerCase() === filter.status ? 'bg-violet-500 text-white' : 'text-violet-500 bg-violet-100 border-violet-500 hover:bg-violet-500 hover:text-white'} py-2 px-4 rounded-md border text-nowrap`}>
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

      <div className='h-[calc(100vh-217.6px)] mb-3'>
        <table className={`flex h-full flex-col mx-3 border ${border} rounded-xl overflow-hidden`}>
          <thead className={`p-5 flex flex-col gap-3 border-b ${border}`}>
            <tr className='text-xs text-gray-400 flex gap-5 justify-between items-center w-full'>
              <RefreshCcw onClick={getUsers} className='text-gray-400 cursor-pointer hover:text-gray-500 size-5' strokeWidth={1.5} />
              <div className='flex gap-5'>
                <p>{count.current} of {count.total}</p>
                <div className='flex gap-3'>
                <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={1.5} stroke='currentColor' className='size-4 hover:text-gray-700 text-gray-400 cursor-pointer' onClick={() => { if (page > 1) setPage((p) => p - 1); }}>
                  <path strokeLinecap='round' strokeLinejoin='round' d='M15.75 19.5 8.25 12l7.5-7.5' />
                </svg>
                <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={1.5} stroke='currentColor' className='size-4 hover:text-gray-700 text-gray-400 cursor-pointer' onClick={() => { if (count.current < count.total) setPage((p) => p + 1); }}>
                  <path strokeLinecap='round' strokeLinejoin='round' d='m8.25 4.5 7.5 7.5-7.5 7.5' />
                </svg>
              </div>
              </div>
            </tr>
            <tr className='grid grid-cols-[250px_repeat(2,minmax(0,1fr))_150px_100px] gap-5 *:font-medium'>
              <td>Name</td><td>Contact</td><td>Last Login</td><td>Status</td><td>Action</td>
            </tr>
          </thead>
          <tbody className='overflow-y-auto'>
            {loading ? (
              Array.from({ length: 4 }, (_, i) => (
                <tr key={i} className='grid grid-cols-[250px_repeat(3,minmax(0,1fr))_150px_100px] gap-5 px-5 py-4 items-center *:animate-pulse text-gray-400'>
                  <div className='flex gap-2 items-center'>
                    <span className={`min-h-12 min-w-12 rounded-full ${dark ? 'bg-[#3a3a3a]' : 'bg-gray-100'}`}></span>
                    <div className='flex flex-col w-full gap-1'>
                      <span className={`py-2 rounded-full h-1 ${dark ? 'bg-[#3a3a3a]' : 'bg-gray-100'}`}></span>
                      <span className={`py-2 rounded-full w-[70%] h-1 ${dark ? 'bg-[#3a3a3a]' : 'bg-gray-100'}`}></span>
                    </div>
                  </div>
                  {Array.from({ length: 4 }, (_, j) => (
                    <span key={j} className={`py-2 rounded-full w-[70%] h-1 ${dark ? 'bg-[#3a3a3a]' : 'bg-gray-100'}`}></span>
                  ))}
                  <span className={`py-4 rounded-md w-10 h-1 ${dark ? 'bg-[#3a3a3a]' : 'bg-gray-100'}`}></span>
                </tr>
              ))
            ) : users ? (
              <UserTable users={users} />
            ) : (
              <p className='mt-30 text-center text-gray-400'>{error || 'No users found'}</p>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
