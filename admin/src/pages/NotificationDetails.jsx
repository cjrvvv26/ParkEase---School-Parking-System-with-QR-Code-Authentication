import React, { useState, useEffect } from 'react';
import { ChevronLeft, Trash } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import useFetch from '../hooks/useFetch';
import useDark from '../hooks/useDark';

export default function NotificationDetails() {
  const navigate = useNavigate();
  const { fetchData, loading, error } = useFetch();
  const [notification, setNotification] = useState(null);
  const { id } = useParams();
  const { dark, border, text } = useDark();

  useEffect(() => {
    const getMessageDetails = async () => {
      const data = await fetchData(`/notifications/${id}`, { method: 'GET' });
      setNotification(data.notification);
      if (!data.notification.read) {
        await fetchData(`/notifications/${id}/read`, { method: 'PUT' });
      }
    };
    getMessageDetails();
  }, [id]);

  const handleDelete = async () => {
    await fetchData(`/notifications/${id}`, { method: 'DELETE' });
    navigate('/notifications');
  };

  if (loading || !notification) {
    return (
      <div className='flex flex-1 items-center justify-center'>
        <div className='border-2 mb-30 border-t-blue-500 border-blue-100 h-12 w-12 rounded-full animate-spin'></div>
      </div>
    );
  }

  return (
    <>
      <header className='flex pt-5 px-5 items-center gap-3 text-sm'>
        <ChevronLeft strokeWidth={1.5} size={20} className='cursor-pointer' onClick={() => navigate('/notifications')} />
        <h1 className='font-bold text-3xl'>Notification Details</h1>
      </header>
      <section className={`flex-1 gap-5 border mx-5 mb-5 rounded-md flex flex-col ${border}`}>
        <header className={`border-b p-5 flex justify-between items-center ${border}`}>
          <div className='flex gap-3 items-center'>
            <p className='text-sm text-gray-400'>Title: </p>
            <h1 className={`font-medium text-sm ${text}`}>{notification?.title}</h1>
          </div>
          <Trash onClick={handleDelete} strokeWidth={1.5} size={20} className='cursor-pointer text-gray-400 hover:text-red-500' />
        </header>

        <main className='flex-1 flex flex-col gap-5 p-5'>
          <header className='flex items-center justify-between'>
            <div className='flex gap-2 items-center'>
              <img src={notification?.userId?.profileDetails?.url} alt='' className='h-12 w-12 object-cover' />
              <div className='flex flex-col text-gray-500'>
                <h2 className={`font-medium ${text}`}>{notification?.userFullName}</h2>
                <p className={`${notification?.userId?.status === 'active' ? 'text-green-500' : 'text-gray-400'} text-sm`}>
                  &#8226;{' '}
                  {notification?.userId?.status.charAt(0).toUpperCase() + notification?.userId?.status.slice(1)}
                </p>
              </div>
            </div>
            <p className='text-sm text-gray-400'>{new Date(notification?.createdAt).toLocaleString()}</p>
          </header>
          <p className={`text-justify text-sm px-32 ${text}`}>{notification?.message}</p>
        </main>
      </section>
    </>
  );
}
