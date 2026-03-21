import GoogleIcon from '../assets/images/google.webp';
import { useGoogleLogin } from '@react-oauth/google';
import axios from '../utils/axiosConfig';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import useFetch from '../hooks/useFetch';
import { useState } from 'react';
import { useEffect } from 'react';

export default function Login() {
  const { error, loading, fetchData } = useFetch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const passwordReset = location.state?.passwordReset;

  useEffect(() => {
    const otp_accesss = sessionStorage.getItem('otp_access');
    if (otp_accesss) {
      navigate('/otp-verification');
    }
  }, []);

  const handleManualLogin = async (e) => {
    e.preventDefault();
    try {
      const data = await fetchData('auth/sign-in', {
        method: 'POST',
        data: { email, password, type: 'login', platform: 'website' },
      });
      console.log(data);
      navigate('/otp-verification');
      sessionStorage.setItem('otp_access', 'true');
      sessionStorage.setItem('otp_type', 'login');
      sessionStorage.setItem('email', email);
    } catch (error) {
      console.log(error);
    }
  };

  //Google login
  const login = useGoogleLogin({
    onSuccess: async (response) => {
      try {
        const { access_token } = response;
        const data = await fetchData('auth/google', {
          method: 'POST',
          data: { access_token, type: 'login' },
        });
        console.log(data);
        navigate('/otp-verification');
        sessionStorage.setItem('otp_access', 'true');
        sessionStorage.setItem('otp_type', 'login');
        sessionStorage.setItem('email', data.email);
      } catch (error) {
        console.log(error);
      }
    },
    onError: (error) => {
      console.log(error);
    },
  });

  return (
    <div className='min-h-screen w-full text-sm text-gray-900 bg-white flex flex-col gap-5 items-center justify-center'>
      {passwordReset && (
        <div className='fixed top-5 left-1/2 -translate-x-1/2 bg-green-50 border border-green-200 text-green-700 text-sm px-5 py-3 rounded-xl shadow'>
          Password reset successfully. Please sign in.
        </div>
      )}
      <div className='flex flex-col gap-3 items-center mb-5'>
        <h1 className='font-bold text-3xl'>Sign In</h1>
        <h2>to continue to your Super Admin Account.</h2>
      </div>
      <form
        onSubmit={handleManualLogin}
        className='flex flex-col gap-5 w-[450px]'
      >
        <div className='flex flex-col gap-1'>
          <input
            type='text'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className='p-4 rounded-lg ring ring-gray-400 hover:ring-2 hover:ring-blue-400 focus:ring-2 focus:ring-blue-400 outline-none w-full'
            placeholder='Enter email address'
          />
        </div>
        <div className='flex flex-col gap-1 relative'>
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className='pl-4 py-4 pr-14 rounded-lg ring ring-gray-400 hover:ring-2 hover:ring-blue-400 focus:ring-2 focus:ring-blue-400 outline-none w-full'
            placeholder='Enter password'
          />
          {(error === 'All fields must be filled' ||
            error === 'Wrong credentials! Please try again.') && (
            <p className='text-xs text-red-500'>{error}</p>
          )}
          {showPassword ? (
            <svg
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              strokeWidth={1.5}
              stroke='currentColor'
              onClick={() => setShowPassword(!showPassword)}
              className='size-6 text-gray-700 absolute top-3.5 right-4 cursor-pointer'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z'
              />
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z'
              />
            </svg>
          ) : (
            <svg
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              strokeWidth={1.5}
              stroke='currentColor'
              onClick={() => setShowPassword(!showPassword)}
              className='size-6 text-gray-400 hover:text-gray-700 cursor-pointer absolute top-3.5 right-4'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88'
              />
            </svg>
          )}
        </div>
        <button
          type='submit'
          disabled={loading}
          className={`${
            !loading ? 'bg-violet-500' : 'bg-gray-400'
          } rounded-lg hover:bg-violet-400 duration-75 p-4 text-white`}
        >
          {loading ? 'Verifying' : 'Continue'}
        </button>
        {error !== 'All fields must be filled' &&
          error !== 'Wrong credentials! Please try again.' &&
          typeof error === 'string' && (
            <p className='text-xs -mt-4 text-red-500'>{error}</p>
          )}
        <div className='border-t relative border-gray-400 w-full'>
          <p className='px-4 absolute bg-white text-gray-400 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2'>
            OR
          </p>
        </div>
        <div className='flex flex-col gap-1'>
          <button
            type='button'
            onClick={() => login()}
            disabled={loading}
            className={`${
              loading ? 'text-gray-400 border-gray-200' : ''
            } p-4 rounded-lg border border-gray-400 flex items-center justify-center gap-3`}
          >
            {!loading && (
              <img
                src={GoogleIcon}
                alt='Google Icon'
                className='object-contain h-5 w-5'
              />
            )}
            <p>{loading ? 'Verifying' : 'Continue with Google'}</p>
          </button>
        </div>
        <div className='text-center text-gray-400 mt-5 flex flex-col gap-3'>
          <p>
            Don't you have an account?{' '}
            <Link className='hover:underline text-purple-500' to='/sign-up'>
              Sign up
            </Link>
          </p>
          <p>
            Can't sign in?{' '}
            <Link
              className='hover:underline text-purple-500'
              to='/account-recovery'
            >
              Go here
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}
