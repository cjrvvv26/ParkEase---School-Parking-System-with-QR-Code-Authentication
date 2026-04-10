import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useFetch from '../hooks/useFetch';
import useDebounce from '../hooks/useDebounce';
import { ChevronLeft, CircleUserRound, Mail } from 'lucide-react';

export default function AccountRecovery() {
  const [email, setEmail] = useState('');
  const [checking, setChecking] = useState(false);
  const [accountInfo, setAccountInfo] = useState(null);
  const { error, setError, loading, fetchData } = useFetch();
  const navigate = useNavigate();
  const debounced = useDebounce(email, 500);

  useEffect(() => {
    if (!debounced) { setAccountInfo(null); setError(''); return; }
    setError('');
    setAccountInfo(null);
    const check = async () => {
      setChecking(true);
      const data = await fetchData('/super-admin/check-account', {
        method: 'POST',
        data: { email: debounced },
      }).catch(() => null);
      setAccountInfo(data?.exists ? data.account : null);
      setChecking(false);
    };
    check();
  }, [debounced]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = await fetchData('/auth/forgot-password/send-otp', {
      method: 'POST',
      data: { email },
    }).catch(() => null);
    if (data?.message === 'OTP sent successfully') {
      sessionStorage.setItem('fp_email', email);
      navigate('/forgot-password/verify-otp');
    }
  };

  return (
    <div className='min-h-screen w-full bg-white flex items-center justify-center text-gray-900'>
      <div className='w-[420px] flex flex-col gap-6'>
        {/* Header */}
        <div className='flex flex-col items-center gap-1 mb-2'>
          <div className='h-14 w-14 rounded-full bg-blue-100 flex items-center justify-center mb-2'>
            <Mail className='text-blue-500' strokeWidth={1.5} size={26} />
          </div>
          <h1 className='text-2xl font-bold'>Forgot Password</h1>
          <p className='text-sm text-gray-400 text-center'>
            Enter your account email and we'll send a verification code.
          </p>
        </div>

        {/* Account preview */}
        <div className='min-h-[64px]'>
          {checking && email ? (
            <div className='flex gap-3 items-center'>
              <span className='w-12 h-12 rounded-full bg-gray-100 animate-pulse flex-shrink-0' />
              <div className='flex flex-col gap-2 flex-1'>
                <span className='h-3.5 w-40 rounded bg-gray-100 animate-pulse' />
                <span className='h-3 w-28 rounded bg-gray-100 animate-pulse' />
              </div>
            </div>
          ) : accountInfo ? (
            <div className='flex gap-3 items-center p-3 rounded-xl bg-blue-50 border border-blue-100'>
              {accountInfo.profileDetails?.url ? (
                <img src={accountInfo.profileDetails.url} className='h-12 w-12 rounded-full object-cover flex-shrink-0' />
              ) : (
                <CircleUserRound strokeWidth={1} className='h-12 w-12 text-gray-400 flex-shrink-0' />
              )}
              <div>
                <p className='font-medium text-sm text-gray-800'>{accountInfo.fullName}</p>
                <p className='text-xs text-gray-400'>{accountInfo.username}</p>
              </div>
            </div>
          ) : null}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className='flex flex-col gap-3'>
          <input
            type='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className='p-4 rounded-xl ring ring-gray-300 hover:ring-blue-400 focus:ring-2 focus:ring-blue-500 outline-none w-full text-sm'
            placeholder='Enter your email address'
          />
          {error && <p className='text-xs text-red-500'>{error}</p>}

          <button
            type='submit'
            disabled={!accountInfo || loading}
            className={`p-4 rounded-xl text-sm font-medium transition-colors ${
              accountInfo && !loading
                ? 'bg-blue-500 hover:bg-blue-600 text-white cursor-pointer'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            {loading ? 'Sending...' : 'Send Verification Code'}
          </button>

          <Link
            to='/sign-in'
            className='flex items-center justify-center gap-2 p-4 rounded-xl border border-gray-200 text-sm text-gray-500 hover:bg-gray-50 transition-colors'
          >
            <ChevronLeft strokeWidth={1.5} size={16} />
            Back to Sign In
          </Link>
        </form>
      </div>
    </div>
  );
}
