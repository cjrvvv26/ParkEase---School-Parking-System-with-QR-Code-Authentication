import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { logout } from '../features/authSlice';
import useFetch from '../hooks/useFetch';
import useDebounce from '../hooks/useDebounce';
import useClickOutside from '../hooks/useClickOutside';
import {
  LayoutDashboard,
  ChartPie,
  CircleParking,
  GraduationCap,
  UsersRound,
  MessagesSquare,
  BookOpen,
  CircleUserRound,
} from 'lucide-react';

export default function Header() {
  const [showSettings, setShowSettings] = useState(false);
  const { error, setError, fetchData } = useFetch();
  const [onFocus, setOnFocus] = useState(false);
  const [query, setQuery] = useState('');
  const [users, setUsers] = useState([]);
  const searchRef = useRef(null);
  const settingsRef = useRef(null);
  const { user } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const debounceQuery = useDebounce(query, 500);

  const floatFeatures = [
    {
      path: '/settings',
      label: 'Settings',
      icon: (
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
            d='M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z'
          />
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            d='M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z'
          />
        </svg>
      ),
    },
    {
      label: 'Sign out',
      icon: (
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
            d='M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15'
          />
        </svg>
      ),
      action: async () => {
        try {
          await fetchData('/super-admin/sign-out', {
            method: 'DELETE',
          });
          dispatch(logout());
          navigate('/sign-in');
        } catch (error) {
          setError(error.response.data.error);
        }
      },
    },
  ];

  const searchPages = [
    {
      icon: <LayoutDashboard strokeWidth={1.5} />,
      name: 'Dashboard',
      link: '/dashboard',
    },
    {
      icon: <ChartPie strokeWidth={1.5} />,
      name: 'Analytics',
      link: '/analytics',
    },
    {
      icon: <CircleParking strokeWidth={1.5} />,
      name: 'Parking',
      link: '/parking',
    },
    {
      icon: <GraduationCap strokeWidth={1.5} />,
      name: 'Semester',
      link: '/semester',
    },
    {
      icon: <UsersRound strokeWidth={1.5} />,
      name: 'Users',
      link: '/users',
    },
    {
      icon: <MessagesSquare strokeWidth={1.5} />,
      name: 'Chats',
      link: '/chat',
    },
    {
      icon: <BookOpen strokeWidth={1.5} />,
      name: 'Activity Logs',
      link: '/activity-logs',
    },
  ];

  useClickOutside(settingsRef, () => setShowSettings(false));

  useClickOutside(searchRef, () => setOnFocus(false));

  const filterSearchPages = searchPages.filter((page) =>
    page.name.toLowerCase().includes(debounceQuery.toLowerCase()),
  );

  const handleUserSearch = async () => {
    if (!debounceQuery.trim()) {
      setUsers([]);
      return;
    }
    const result = await fetchData(
      `/user/search?q=${encodeURIComponent(debounceQuery)}`,
      {
        method: 'GET',
      },
    );
    setUsers(Array.isArray(result) ? result : []);
  };

  useEffect(() => {
    handleUserSearch();
  }, [debounceQuery]);

  const handleShowSettings = () => {
    setShowSettings(!showSettings);
    console.log(showSettings);
  };

  const handleSearchShortcut = (e) => {
    setOnFocus(false);
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'f') {
      e.preventDefault();
      searchRef.current?.focus();
      setOnFocus(true);
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleSearchShortcut);

    return () => {
      window.removeEventListener('keydown', handleSearchShortcut);
    };
  }, []);

  const { theme } = useSelector((state) => state.auth);
  const dark = theme === 'dark';

  return (
    <div
      className={`h-[80px] relative rounded-xl flex items-center justify-between px-4 ${dark ? 'bg-[#242424] text-gray-200' : 'bg-white text-gray-700'}`}
    >
      {/* Search */}
      <div
        ref={searchRef}
        className={`flex relative gap-2 rounded-full h-[50px] w-[400px] items-center justify-center ${dark ? 'bg-[#2f2f2f]' : 'bg-gray-100'}`}
      >
        <div
          className={`flex ml-2 items-center justify-center rounded-full h-9 w-9 ${dark ? 'bg-[#3a3a3a]' : 'bg-white'}`}
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth={1.5}
            stroke='currentColor'
            className='size-5 text-gray-400'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z'
            />
          </svg>
        </div>
        <input
          type='text'
          placeholder='Search'
          onFocus={() => setOnFocus(true)}
          onChange={(e) => setQuery(e.target.value)}
          className={`flex-1 h-full outline-none bg-transparent ${dark ? 'text-gray-200 placeholder-gray-500' : 'text-gray-700'}`}
        />
        <div
          className={`flex text-xs text-gray-400 mr-2 items-center justify-center gap-1 px-2 rounded-xl h-9 ${dark ? 'bg-[#3a3a3a]' : 'bg-white'}`}
        >
          <span
            className={`py-1 px-2 text-[10px] rounded-lg ${dark ? 'bg-[#2f2f2f]' : 'bg-gray-100'}`}
          >
            ctrl
          </span>{' '}
          +<p>F</p>
        </div>
        {/* Show search result */}
        {debounceQuery || onFocus ? (
          <div
            className={`absolute z-20 flex flex-col top-13 gap-1 text-gray-400 border rounded-xl p-3 w-full self-start ${dark ? 'bg-[#2f2f2f] border-[#3a3a3a]' : 'bg-white border-gray-200'}`}
          >
            {filterSearchPages.length > 0 && (
              <p className='text-[10px] text-gray-400'>Pages</p>
            )}
            {filterSearchPages.map((p, i) => (
              <Link
                to={p.link}
                key={i}
                onClick={() => {
                  setOnFocus(false);
                  setQuery('');
                }}
                className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer ${dark ? 'text-gray-300 hover:bg-[#3a3a3a]' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
              >
                {p.icon}
                <span>{p.name}</span>
              </Link>
            ))}

            {users.length > 0 ? (
              <>
                <p className='text-[10px] text-gray-400 mt-1'>Users</p>
                {users.map((user, _) => (
                  <Link
                    to={`/users/${user._id}`}
                    onClick={() => {
                      setOnFocus(false);
                      setQuery('');
                    }}
                    key={user._id}
                    className={`flex items-center group gap-3 p-2 rounded-lg cursor-pointer ${dark ? 'text-gray-300 hover:bg-[#3a3a3a]' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
                  >
                    {user?.profileDetails?.url ? (
                      <img
                        src={user.profileDetails.url}
                        alt=''
                        className='w-8 h-8 rounded-full'
                      />
                    ) : (
                      <CircleUserRound strokeWidth={1.5} size={30} />
                    )}

                    <div className='flex flex-col'>
                      <span>
                        {[
                          user.name?.firstName,
                          user.name?.middleName,
                          user.name?.lastName,
                        ]
                          .filter(Boolean)
                          .join(' ') || user.username}
                      </span>
                      <span className='text-[10px] group-hover:text-gray-500 text-gray-400'>
                        {user.email || user.role}
                      </span>
                    </div>
                  </Link>
                ))}
              </>
            ) : null}
          </div>
        ) : !debounceQuery && onFocus ? (
          <div className='absolute top-13 w-full border-gray-200 border bg-white rounded-xl py-5'>
            <p className='text-center text-xs text-gray-400'>
              Search by name, email, username or page
            </p>
          </div>
        ) : null}
      </div>

      {/* Right Header Section */}
      <div className='flex items-center gap-3'>
        {/* Header Icons */}
        <div className='flex gap-3 duration-75 items-center'>
          <div className='relative'>
            {/* Notification bar */}
            <Link
              to={'/notifications'}
              onClick={() => setShowNotification(!showNotification)}
              className={`relative flex items-center justify-center rounded-xl box-border p-2 h-12 w-12 cursor-pointer ${dark ? 'hover:bg-[#2f2f2f]' : 'hover:bg-gray-100'}`}
            >
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
                  d='M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0'
                />
              </svg>
              <div className='h-1 w-1 rounded-full bg-rose-400 absolute left-7 bottom-8'></div>
            </Link>
          </div>
        </div>
        {/* User Profile */}
        <div
          ref={settingsRef}
          onClick={handleShowSettings}
          className={`flex gap-2 relative select-none items-center duration-75 cursor-pointer p-2 rounded-xl ${dark ? 'hover:bg-[#2f2f2f]' : 'hover:bg-gray-100'}`}
        >
          {/* Basic Info */}
          {user.profileDetails?.url ? (
            <img
              src={user.profileDetails.url}
              alt=''
              className='h-10 w-10 object-cover rounded-full'
            />
          ) : (
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 24 24'
              fill='currentColor'
              className='size-10 text-gray-400'
            >
              <path
                fillRule='evenodd'
                d='M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z'
                clipRule='evenodd'
              />
            </svg>
          )}
          <div className='flex flex-col'>
            <h2 className='text-nowrap font-medium'>{user.name}</h2>
            <p className='text-gray-400 text-xs'>{user.username}</p>
          </div>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth={1.5}
            stroke='currentColor'
            className={`${
              showSettings ? 'rotate-180' : 'rotate-0'
            } size-6 text-gray-400 ml-2 duration-100`}
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='m19.5 8.25-7.5 7.5-7.5-7.5'
            />
          </svg>

          {/* Additional Navigation */}
          {showSettings && (
            <div
              className={`border absolute top-15 w-[300px] right-0 overflow-hidden rounded-lg flex flex-col z-10 ${dark ? 'bg-[#2f2f2f] border-[#3a3a3a]' : 'bg-white border-gray-200'}`}
            >
              <div className='flex gap-3 px-2 py-4 items-center'>
                {/* <img
                  src={Me}
                  alt=""
                  className="h-12 w-12 object-cover rounded-full"
                /> */}
                {user?.profileDetails?.url ? (
                  <img
                    src={user?.profileDetails.url}
                    alt=''
                    className='h-12 w-12 rounded-full object-cover'
                  />
                ) : (
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 24 24'
                    fill='currentColor'
                    className='size-12 text-gray-400'
                  >
                    <path
                      fillRule='evenodd'
                      d='M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z'
                      clipRule='evenodd'
                    />
                  </svg>
                )}
                <div className='flex flex-col '>
                  <h2 className='text-sm font-medium'>{user.name}</h2>
                  <Link
                    to='/account-details'
                    className='text-xs hover:text-blue-500 hover:underline text-gray-400'
                  >
                    Account details
                  </Link>
                </div>
              </div>

              <div
                className={`border-t ${dark ? 'border-[#3a3a3a]' : 'border-gray-200'}`}
              >
                {floatFeatures.map((feature, index) => (
                  <Link
                    to={feature.path}
                    onClick={async () => {
                      if (feature.action) await feature.action();
                    }}
                    key={index}
                    className={`flex items-center gap-3 py-4 px-4 hover:bg-blue-500 hover:text-white ${dark ? 'text-gray-300' : ''}`}
                  >
                    {feature.icon}
                    <p>{feature.label}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
