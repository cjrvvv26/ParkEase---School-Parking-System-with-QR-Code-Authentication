import GoogleIcon from '../assets/images/google.webp';
import { useGoogleLogin } from '@react-oauth/google';
import { Link, useNavigate } from 'react-router-dom';
import useFetch from '../hooks/useFetch';
import { useState } from 'react';
import Logo from '../assets/images/urs-logo.jpg';
import { User, Mail, CheckCircle } from 'lucide-react';

export default function Registration() {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const { error, loading, fetchData } = useFetch();
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await fetchData('/auth/sign-up', {
        method: 'POST',
        data: { firstName, lastName, email },
      });
      sessionStorage.setItem('otp_access', 'true');
      sessionStorage.setItem('otp_type', 'register');
      sessionStorage.setItem('email', email);
      navigate('/otp-verification');
    } catch {}
  };

  const register = useGoogleLogin({
    onSuccess: async ({ access_token }) => {
      try {
        const data = await fetchData('auth/google', {
          method: 'POST',
          data: { access_token, type: 'register' },
        });
        sessionStorage.setItem('otp_access', 'true');
        sessionStorage.setItem('otp_type', 'register');
        sessionStorage.setItem('email', data.email);
        navigate('/otp-verification');
      } catch {}
    },
    onError: () => {},
  });

  return (
    <div className='min-h-screen w-full flex'>
      {/* Left panel */}
      <div className='hidden lg:flex w-[45%] bg-blue-600 flex-col items-center justify-center p-12 relative overflow-hidden'>
        <div className='absolute -top-24 -left-24 w-96 h-96 bg-blue-500 rounded-full opacity-40' />
        <div className='absolute -bottom-32 -right-20 w-[28rem] h-[28rem] bg-blue-700 rounded-full opacity-40' />
        <div className='relative z-10 flex flex-col items-center text-center gap-6'>
          <img
            src={Logo}
            alt='Logo'
            className='h-28 w-28 object-contain rounded-2xl shadow-2xl'
          />
          <div className='flex flex-col gap-2'>
            <h1 className='text-white font-bold text-3xl leading-tight'>
              University of Rizal System
            </h1>
            <p className='text-blue-100 text-lg font-medium'>Cainta Campus</p>
            <div className='w-12 h-1 bg-white/40 rounded-full mx-auto my-1' />
            <p className='text-blue-100 text-base'>School Parking System</p>
          </div>
          <div className='mt-4 flex flex-col gap-3 w-full max-w-xs'>
            {[
              'Smart QR-based parking management',
              'Real-time slot monitoring',
              'Comprehensive analytics & reports',
            ].map((t) => (
              <div
                key={t}
                className='flex items-center gap-3 bg-white/10 rounded-xl px-4 py-3'
              >
                <CheckCircle size={16} className='text-blue-200 shrink-0' />
                <p className='text-blue-100 text-sm text-left'>{t}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className='flex-1 flex items-center justify-center bg-gray-50 p-6'>
        <div className='w-full max-w-md'>
          {/* Mobile logo */}
          <div className='flex lg:hidden flex-col items-center gap-2 mb-8'>
            <img
              src={Logo}
              alt='Logo'
              className='h-16 w-16 object-contain rounded-xl'
            />
            <p className='text-blue-600 font-bold text-lg text-center'>
              University of Rizal System
            </p>
            <p className='text-gray-400 text-sm'>
              Cainta Campus · School Parking System
            </p>
          </div>

          <div className='bg-white rounded-2xl border border-gray-200 p-8'>
            <div className='mb-7'>
              <h1 className='font-bold text-2xl text-gray-800'>
                Create account
              </h1>
              <p className='text-gray-400 text-sm mt-1'>
                Set up your Super Admin account
              </p>
            </div>

            <form onSubmit={handleRegister} className='flex flex-col gap-5'>
              {/* Name row */}
              <div className='flex gap-4'>
                <div className='flex flex-col gap-1.5 flex-1'>
                  <label className='text-xs font-semibold text-gray-500 uppercase tracking-wide'>
                    First Name
                  </label>
                  <div className='flex items-center gap-3 border border-gray-200 rounded-xl px-4 py-3 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 transition bg-gray-50'>
                    <User size={15} className='text-gray-400 shrink-0' />
                    <input
                      type='text'
                      value={
                        firstName.charAt(0).toUpperCase() + firstName.slice(1)
                      }
                      onChange={(e) => setFirstName(e.target.value)}
                      className='flex-1 bg-transparent outline-none text-sm text-gray-800 placeholder-gray-400'
                      placeholder='Juan'
                    />
                  </div>
                </div>
                <div className='flex flex-col gap-1.5 flex-1'>
                  <label className='text-xs font-semibold text-gray-500 uppercase tracking-wide'>
                    Last Name
                  </label>
                  <div className='flex items-center gap-3 border border-gray-200 rounded-xl px-4 py-3 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 transition bg-gray-50'>
                    <User size={15} className='text-gray-400 shrink-0' />
                    <input
                      type='text'
                      value={
                        lastName.charAt(0).toUpperCase() + lastName.slice(1)
                      }
                      onChange={(e) => setLastName(e.target.value)}
                      className='flex-1 bg-transparent outline-none text-sm text-gray-800 placeholder-gray-400'
                      placeholder='Dela Cruz'
                    />
                  </div>
                </div>
              </div>

              {/* Email */}
              <div className='flex flex-col gap-1.5'>
                <label className='text-xs font-semibold text-gray-500 uppercase tracking-wide'>
                  Email Address
                </label>
                <div className='flex items-center gap-3 border border-gray-200 rounded-xl px-4 py-3 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 transition bg-gray-50'>
                  <Mail size={16} className='text-gray-400 shrink-0' />
                  <input
                    type='text'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className='flex-1 bg-transparent outline-none text-sm text-gray-800 placeholder-gray-400'
                    placeholder='admin@urs.edu.ph'
                  />
                </div>
                {error && (
                  <p className='text-xs text-red-500 mt-0.5'>{error}</p>
                )}
              </div>

              {/* Submit */}
              <button
                type='submit'
                disabled={loading}
                className='w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-semibold py-3 rounded-xl transition text-sm mt-1'
              >
                {loading ? 'Creating account...' : 'Create Account'}
              </button>

              {/* Divider */}
              <div className='flex items-center gap-3'>
                <div className='flex-1 h-px bg-gray-200' />
                <span className='text-xs text-gray-400'>or continue with</span>
                <div className='flex-1 h-px bg-gray-200' />
              </div>

              {/* Google */}
              <button
                type='button'
                onClick={() => register()}
                disabled={loading}
                className='w-full flex items-center justify-center gap-3 border border-gray-200 rounded-xl py-3 hover:bg-gray-50 transition text-sm text-gray-600 font-medium disabled:opacity-50'
              >
                <img
                  src={GoogleIcon}
                  alt='Google'
                  className='h-4 w-4 object-contain'
                />
                Continue with Google
              </button>
            </form>

            <p className='mt-6 text-center text-sm text-gray-400'>
              Already have an account?{' '}
              <Link
                to='/sign-in'
                className='text-blue-600 font-medium hover:underline'
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
