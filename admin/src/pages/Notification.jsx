import React, { useState, useEffect } from 'react';
import { Trash } from 'lucide-react';
import { Link } from 'react-router-dom';
import useFetch from '../hooks/useFetch';

export default function Notification() {
  const { fetchData, loading, error } = useFetch();
  const [notifications, setNotifications] = useState([]);
  useEffect(() => {
    const getNotifications = async () => {
      const data = await fetchData('/notifications');
      setNotifications(data);
      console.log(data);
    };
    getNotifications();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <header className='flex justify-between px-5 pt-5 items-center'>
        <div className='flex flex-col'>
          <h1 className='font-bold text-3xl'>Notifications</h1>
          <p className='text-gray-400'>Manage system notifications.</p>
        </div>
      </header>
      <section className='flex-1 self-center mt-5 flex flex-col'>
        {notifications.map((notification, _) => (
          <Link
            key={notification._id}
            to={`/notifications/${notification._id}`}
            className='py-4 overflow-hidden group hover:bg-gray-100 rounded-md cursor-pointer px-5 items-center grid grid-cols-3'
          >
            <div className='flex gap-2'>
              <img
                src=''
                alt=''
                className='h-12 w-12 object-cover rounded-full'
              />
              <div className='flex flex-col'>
                <h2 className='font-medium'>Clarence James</h2>
                <p className='text-sm text-green-500'>Online</p>
              </div>
            </div>
            <div className='flex flex-col gap-1'>
              <h1 className='font-bold'>{notification.title}</h1>
              <p className='text-gray-600'>{notification.message}</p>
            </div>
            <div className='flex items-center gap-3 justify-end'>
              <span className='rounded-full h-3 w-3 bg-violet-500'></span>
              <Trash
                size={20}
                strokeWidth={1.5}
                className='text-gray-400 hover:text-red-500 relative duration-200 group-hover:left-0 left-20 cursor-pointer'
              />
            </div>
          </Link>
        ))}
      </section>
    </>
  );
}
