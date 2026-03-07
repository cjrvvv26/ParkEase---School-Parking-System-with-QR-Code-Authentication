import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import useFetch from '../hooks/useFetch';
import { useNavigate } from 'react-router-dom';
import useDebounce from '../hooks/useDebounce';
import { ChevronLeft, CircleUserRound } from 'lucide-react';

export default function AccountRecovery() {
  const [email, setEmail] = useState('');
  const [isIdentify, setIsIdentify] = useState(false);
  const [checking, setChecking] = useState(false);
  const [accountInfo, setAccountInfo] = useState(null);
  const { error, setError, loading, fetchData } = useFetch();
  const navigate = useNavigate();
  const debounceAccount = useDebounce(email, 500);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = await fetchData('/user/recovery/send-request', {
      method: 'POST',
      data: { email },
    });

    if (data.message === 'Recovery email sent') {
      navigate('/sign-in', { replace: true, state: { recoverySuccess: true } });
    }
  };

  useEffect(() => {
    if (debounceAccount) {
      setError(null);
      setIsIdentify(false);
      setAccountInfo(null);
      const checkAccount = async () => {
        setChecking(true);

        const data = await fetchData('/super-admin/check-account', {
          method: 'POST',
          data: { email: debounceAccount },
        });

        if (data?.exists) {
          setIsIdentify(true);
          setAccountInfo(data.account);
        } else {
          setIsIdentify(false);
          setAccountInfo(null);
        }

        setChecking(false);
      };

      checkAccount();
    } else {
      setIsIdentify(false);
      setAccountInfo(null);
    }
  }, [debounceAccount]);

  return (
    <div className='flex min-h-screen w-full text-gray-900 items-center justify-center'>
      <div className='flex flex-col gap-5'>
        <header className='flex mb-5 flex-col items-center'>
          <h1 className='text-3xl font-bold'>Recover Your Account</h1>
          <p className='text-sm'>by sending an email confirmation</p>
        </header>

        {/* Info skeleton */}
        {error === 'No account found' ? (
          <p className='text-gray-400 text-sm'>{error}. Please try again</p>
        ) : checking && email ? (
          <section className='flex gap-3 self-start'>
            <span className='w-14 h-14 rounded-full bg-gray-200 animate-pulse'></span>
            <div className='flex flex-col'>
              <span className='w-48 h-4 rounded-full bg-gray-200 animate-pulse'></span>
              <span className='w-32 h-4 rounded-full bg-gray-200 animate-pulse mt-2'></span>
            </div>
          </section>
        ) : isIdentify && accountInfo ? (
          <>
            <p className='text-xs text-gray-400'>Is this your account?</p>
            <div className='flex gap-3 items-center self-start'>
              {accountInfo.profileDetails?.url ? (
                <img
                  src={accountInfo.profileDetails.url}
                  alt={accountInfo.profileDetails.url}
                  className='h-14 w-14 object-cover rounded-full'
                />
              ) : (
                <CircleUserRound
                  strokeWidth={1}
                  className='h-14 w-14 text-gray-400'
                />
              )}
              <div className='flex flex-col'>
                <p className='text-gray-700 font-medium text-base'>
                  {accountInfo?.fullName}
                </p>
                <p className='text-gray-400 text-sm'>{accountInfo?.username}</p>
              </div>
            </div>
          </>
        ) : null}

        <form action='' className='w-[400px]'>
          <input
            type='text'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className='p-4 rounded-lg ring ring-gray-400 hover:ring-2 hover:ring-violet-500 focus:ring-2 focus:ring-violet-500 outline-none w-full'
            placeholder='Enter email address'
          />
          {isIdentify ? (
            <div className='flex mt-5 justify-center items-center gap-3'>
              <Link
                to='/sign-in'
                className='flex hover:text-gray-400 rounded-full text-center items-center gap-3 bg-gray-300 hover:bg-gray-100 text-white p-4'
              >
                <ChevronLeft strokeWidth={1.5} className='size-6' />
              </Link>
              <input
                disabled={!isIdentify}
                onClick={handleSubmit}
                type='submit'
                value='Send Recovery Email'
                className={`${isIdentify ? 'bg-violet-500 hover:bg-violet-400 text-white cursor-pointer' : 'cursor-not-allowed bg-gray-200 text-gray-400'} flex-1 p-4 rounded-lg w-full`}
              />
            </div>
          ) : (
            <Link
              to='/sign-in'
              className='flex mt-5 text-sm justify-center items-center gap-3 hover:text-gray-400 bg-gray-300 hover:bg-gray-100 text-white p-4 rounded-lg w-full'
            >
              <ChevronLeft strokeWidth={1.5} className='size-6' />
              <span>Back to Sign In</span>
            </Link>
          )}
        </form>
      </div>
    </div>
  );
}
