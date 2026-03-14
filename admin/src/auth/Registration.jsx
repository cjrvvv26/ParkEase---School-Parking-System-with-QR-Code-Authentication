import GoogleIcon from '../assets/images/google.webp';
import { useGoogleLogin } from '@react-oauth/google';
import { Link, useNavigate } from 'react-router-dom';
import useFetch from '../hooks/useFetch';
import { useState } from 'react';

export default function Registration() {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const { error, loading, fetchData } = useFetch();
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await fetchData('/auth/sign-up', {
        method: 'POST',
        data: { firstName, lastName, email },
      });
      console.log(res);
      sessionStorage.setItem('otp_access', 'true');
      sessionStorage.setItem('otp_type', 'register');
      sessionStorage.setItem('email', email);
      navigate('/otp-verification');
    } catch (error) {
      console.log(error.message);
    }
  };

  const register = useGoogleLogin({
    onSuccess: async (response) => {
      try {
        const { access_token } = response;
        const data = await fetchData('auth/google', {
          method: 'POST',
          data: { access_token, type: 'register' },
        });
        console.log(data);
        navigate('/otp-verification');
        sessionStorage.setItem('otp_access', 'true');
        sessionStorage.setItem('otp_type', 'register');
        sessionStorage.setItem('email', data.email);
      } catch (error) {
        console.log(error);
      }
    },
    onError: (err) => {
      console.log(err);
    },
  });

  return (
    <div className='min-h-screen w-full text-sm text-gray-900 bg-white flex flex-col gap-5 items-center justify-center'>
      <div className='flex flex-col gap-3 items-center mb-5'>
        <h1 className='font-bold text-3xl'>Sign Up</h1>
        <h2>to continue to your Super Admin Account.</h2>
      </div>
      <form onSubmit={handleRegister} className='flex flex-col gap-5 w-[450px]'>
        <div className='flex gap-5'>
          <input
            type='text'
            value={firstName.charAt(0).toUpperCase() + firstName.slice(1)}
            onChange={(e) => {
              setFirstName(e.target.value);
            }}
            className='p-4 rounded-lg ring ring-gray-400 hover:ring-2 hover:ring-blue-400 focus:ring-2 focus:ring-blue-400 outline-none w-full'
            placeholder='First name'
          />
          <input
            type='text'
            value={lastName.charAt(0).toUpperCase() + lastName.slice(1)}
            onChange={(e) => {
              setLastName(e.target.value);
            }}
            className='p-4 rounded-lg ring ring-gray-400 hover:ring-2 hover:ring-blue-400 focus:ring-2 focus:ring-blue-400 outline-none w-full'
            placeholder='Last name'
          />
        </div>
        <div className='flex-col gap-1 flex'>
          <input
            type='text'
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            className='p-4 rounded-lg ring ring-gray-400 hover:ring-2 hover:ring-blue-400 focus:ring-2 focus:ring-blue-400 outline-none w-full'
            placeholder='Enter email address'
          />
          <p className='text-xs text-red-500'>
            {error === 'All fields must be filled' &&
              'Invalid email address' &&
              error}
          </p>
        </div>
        <button
          onClick={handleRegister}
          disabled={loading}
          className={`rounded-lg p-4 hover:bg-violet-400 duration-75 text-white ${
            !loading ? ' bg-violet-500' : 'bg-gray-400'
          }`}
        >
          {loading ? 'Verifying' : 'Continue'}
        </button>

        <div className='border-t relative border-gray-400 w-full'>
          <p className='px-4 absolute bg-white text-gray-400 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2'>
            OR
          </p>
        </div>
        <div className='flex flex-col gap-1'>
          <button
            disabled={loading}
            onClick={() => register()}
            className={`${
              loading && 'text-gray-400 border-gray-200'
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
          <p className='text-xs text-red-500'>
            {error !== 'All fields must be filled' && error}
          </p>
        </div>
        <p className='text-gray-400 text-center'>
          Already have an account?{' '}
          <Link to='/sign-in' className='hover:underline text-purple-500'>
            Sign in
          </Link>
        </p>
      </form>
    </div>
  );
}
