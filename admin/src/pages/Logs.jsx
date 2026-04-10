import { useState, useEffect } from 'react';
import {
  ClipboardList,
  ParkingCircle,
  Settings,
  Users,
  Map,
} from 'lucide-react';
import useFetch from '../hooks/useFetch';
import useDark from '../hooks/useDark';

export default function Logs() {
  const filterList = [
    {
      icon: <ClipboardList strokeWidth={1.5} size={20} />,
      label: 'All',
      value: 'all',
    },
    {
      icon: <Users strokeWidth={1.5} size={20} />,
      label: 'Users',
      value: 'users',
    },
    {
      icon: <ParkingCircle strokeWidth={1.5} size={20} />,
      label: 'Parking',
      value: 'parking',
    },
    { icon: <Map strokeWidth={1.5} size={20} />, label: 'Map', value: 'map' },
    {
      icon: <Settings strokeWidth={1.5} size={20} />,
      label: 'System',
      value: 'system',
    },
  ];
  const { fetchData, loading, error } = useFetch();
  const [activeIndex, setActiveIndex] = useState(0);
  const [actionType, setActionType] = useState('all');
  const [page, setPage] = useState(1);
  const limit = 10;
  const [logs, setLogs] = useState([]);
  const [total, setTotal] = useState(0);
  const { dark, border, hover } = useDark();

  useEffect(() => {
    const getLogs = async () => {
      const data = await fetchData(
        `/activity?page=${page}&limit=${limit}&actionType=${actionType}`,
      );
      setLogs(data.logs);
      setTotal(data.total);
    };
    getLogs();
  }, [actionType, page]);

  return (
    <>
      <div className='flex justify-between items-center pt-5 px-5'>
        <div className='flex flex-col'>
          <h1 className='font-bold text-3xl'>Activity Logs</h1>
          <p className='text-gray-400'>
            See every activity occurring within the system
          </p>
        </div>
        <div className='flex gap-5 items-center text-gray-400'>
          <p className='text-sm'>
            {logs.length > 0 ? (page - 1) * limit + 1 : 0} –{' '}
            {(page - 1) * limit + logs.length} of {total}
          </p>
          <div className='flex gap-3'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              strokeWidth={1.5}
              stroke='currentColor'
              className='size-4 cursor-pointer hover:text-gray-700'
              onClick={() => {
                if (page > 1) setPage((p) => p - 1);
              }}
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
              className='size-4 cursor-pointer hover:text-gray-700'
              onClick={() => {
                if ((page - 1) * limit + logs.length !== total)
                  setPage((p) => p + 1);
              }}
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='m8.25 4.5 7.5 7.5-7.5 7.5'
              />
            </svg>
          </div>
        </div>
      </div>

      <div className='flex flex-1 flex-col'>
        <div
          className={`border-b-2 ${border} px-5 gap-3 grid grid-cols-[repeat(5,minmax(0,1fr))] place-items-center`}
        >
          {filterList.map((header, index) => (
            <button
              key={index}
              onClick={() => {
                setActiveIndex(index);
                setActionType(header.value);
              }}
              className={`${activeIndex === index ? "before:content-[''] before:absolute before:w-full before:-bottom-[1.5px] before:rounded-ss-md before:rounded-se-md before:border-b-4 before:border-blue-500 text-blue-500" : ''} flex gap-3 items-center py-2 justify-center w-full rounded-ss-xl rounded-se-xl relative cursor-pointer z-0 ${dark ? 'hover:bg-blue-500/10' : 'hover:bg-blue-100'} hover:text-blue-500`}
            >
              {header.icon}
              <p>{header.label}</p>
            </button>
          ))}
        </div>

        {loading && (
          <div className='flex-1 flex items-center justify-center'>
            <div className='border-2 border-t-blue-500 border-blue-100 h-12 w-12 rounded-full animate-spin'></div>
          </div>
        )}
        {error && <p className='text-center mt-36 text-gray-400'>{error}</p>}
        {logs.length < 1 && !loading && (
          <p className='text-center mt-36 text-gray-400'>No records found</p>
        )}

        {!loading &&
          logs &&
          logs.map((log) => (
            <div
              key={log._id}
              className={`py-4 px-2 w-full grid grid-cols-[1fr_2fr_auto] gap-3 ${dark ? 'hover:bg-[#2f2f2f]' : 'hover:bg-gray-100'}`}
            >
              <div className='flex gap-3 items-center min-w-0'>
                <img
                  src={log.userId?.profileDetails?.url}
                  alt=''
                  className='h-12 w-12 object-cover rounded-full flex-shrink-0'
                />
                <p className='font-medium text-sm overflow-hidden text-nowrap truncate'>
                  {log.userFullName}
                </p>
              </div>
              <div className='flex items-center text-left overflow-hidden min-w-0'>
                <p
                  className={`truncate ${dark ? 'text-gray-300' : 'text-gray-700'}`}
                >
                  {log.description}
                </p>
              </div>
              <p className='items-center flex justify-center text-xs font-medium text-gray-400 flex-shrink-0 whitespace-nowrap'>
                {new Date(log.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
      </div>
    </>
  );
}
