import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Trash } from 'lucide-react';
import { Link } from 'react-router-dom';
import useFetch from '../hooks/useFetch';
import { useSelector } from 'react-redux';
import useDark from '../hooks/useDark';

export default function Notification() {
  const { fetchData, loading } = useFetch();
  const { user } = useSelector((state) => state.auth);
  const [notifications, setNotifications] = useState([]);
  const [page, setPage] = useState(1);
  const [type, setType] = useState('all');
  const [total, setTotal] = useState(0);
  const totalPages = Math.ceil(total / 10);
  const { dark, border, hover } = useDark();

  useEffect(() => {
    const getNotifications = async () => {
      const data = await fetchData(`/notifications?page=${page}&limit=10&type=${type}&userId=${user.userId}`, { method: 'GET' });
      setNotifications(data.notifications);
      setTotal(data.total);
    };
    getNotifications();
  }, [type, page]);

  const handleDelete = async (id) => {
    await fetchData(`/notifications/${id}`, { method: 'DELETE' });
  };

  return (
    <>
      <header className='flex justify-between px-5 pt-5 items-center'>
        <div className='flex flex-col'>
          <h1 className='font-bold text-3xl'>Notifications</h1>
          <p className='text-gray-400'>Manage system notifications.</p>
        </div>
      </header>
      <section className='flex-1 items-center gap-5 mt-5 flex flex-col'>
        <header className='max-w-3xl w-full flex justify-between items-center'>
          <div className={`${dark ? 'bg-[#2f2f2f]' : 'bg-gray-100'} *:py-2 *:hover:bg-violet-500 *:hover:text-white text-gray-600 *:rounded-md text-sm *:px-5 rounded-md p-2 flex gap-3`}>
            {['all', 'read', 'unread'].map((option) => (
              <button key={option} onClick={() => { setType(option); setPage(1); }} className={`${type === option ? 'bg-violet-500 text-white' : ''}`}>
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </button>
            ))}
          </div>
          <div className='flex text-xs gap-5 text-gray-400 mr-5 items-center'>
            <p>{(page - 1) * 10 + 1} - {(page - 1) * 10 + notifications.length} of {total}</p>
            <div className='flex gap-2'>
              <ChevronLeft onClick={() => { if (page > 1) setPage((p) => p - 1); }} className={`${page === 1 ? 'text-gray-300 cursor-not-allowed' : 'cursor-pointer hover:text-gray-500'}`} strokeWidth={1.5} size={20} />
              <ChevronRight onClick={() => { if (page < totalPages) setPage((p) => p + 1); }} className={`${page === totalPages || totalPages === 0 ? 'text-gray-300 cursor-not-allowed' : 'cursor-pointer hover:text-gray-500'}`} strokeWidth={1.5} size={20} />
            </div>
          </div>
        </header>

        {loading ? (
          <div className='flex-1 flex items-center justify-center'>
            <div className='border-2 mb-30 border-t-violet-500 border-violet-100 h-12 w-12 rounded-full animate-spin'></div>
          </div>
        ) : notifications.length === 0 && (
          <div className='flex-1 flex items-center justify-center mt-30 text-gray-500'>
            <span className='mb-30'>No messages</span>
          </div>
        )}

        {!loading && notifications.map((notification) => (
          <Link
            key={notification._id}
            to={`/notification/${notification._id}`}
            state={{ notification }}
            className={`py-4 px-5 max-w-3xl overflow-hidden group rounded-md cursor-pointer items-center grid grid-cols-[auto_1fr_auto] gap-5 ${dark ? 'hover:bg-[#2f2f2f]' : 'hover:bg-gray-100'}`}
          >
            <div className='flex gap-2'>
              <img src={notification.userId?.profileDetails?.url} alt='' className='h-12 w-12 object-cover rounded-full' />
              <div className='flex flex-col'>
                <h2 className='font-medium overflow-hidden text-pretty whitespace-nowrap w-32'>{notification.userFullName}</h2>
                <p className='text-sm text-green-500'>Online</p>
              </div>
            </div>
            <div className='flex flex-col gap-1 flex-1'>
              <h1 className='font-bold'>{notification.title}</h1>
              <p className={`line-clamp-3 ${dark ? 'text-gray-400' : 'text-gray-600'}`}>{notification.message}</p>
            </div>
            <div className='flex items-center gap-3 h-full justify-end'>
              {!notification.read && <span className='rounded-full h-3 w-3 bg-violet-500'></span>}
              <div
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleDelete(notification._id); }}
                className='flex relative duration-200 h-10 group-hover:w-10 hover:opacity-80 rounded-md items-center justify-center group-hover:left-0 left-20 cursor-pointer bg-red-100 border-red-500 border'
              >
                <Trash size={20} strokeWidth={1.5} className='text-red-500' />
              </div>
            </div>
          </Link>
        ))}
      </section>
    </>
  );
}
