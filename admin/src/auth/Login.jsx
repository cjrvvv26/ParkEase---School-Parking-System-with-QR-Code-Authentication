import GoogleIcon from '../assets/images/google.webp';
import { useGoogleLogin } from '@react-oauth/google';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import useFetch from '../hooks/useFetch';
import { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import Logo from '../assets/images/urs-logo.jpg';
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  CheckCircle,
  Loader2,
  XCircle,
} from 'lucide-react';
import axios from '../utils/axiosConfig';

export default function Login() {
  const { error, loading, fetchData } = useFetch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [slowConnection, setSlowConnection] = useState(false);
  const [emailChecking, setEmailChecking] = useState(false);
  const [emailValid, setEmailValid] = useState(null);
  const [emailError, setEmailError] = useState('');
  const [googleError, setGoogleError] = useState('');
  const debounceRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const passwordReset = location.state?.passwordReset;
  const superAdminExists = useSelector((s) => s.auth.superAdminExists);

  useEffect(() => {
    if (sessionStorage.getItem('otp_access')) navigate('/otp-verification');
  }, []);

  const checkEmail = async (val) => {
    if (!val) {
      setEmailValid(null);
      setEmailError('');
      return false;
    }
    setEmailChecking(true);
    setEmailValid(null);
    setEmailError('');
    try {
      const res = await axios.post('/super-admin/check-account', {
        email: val,
        requireRole: 'super admin',
      });
      if (res.data?.exists) {
        setEmailValid(true);
        setEmailError('');
        return true;
      } else {
        setEmailValid(false);
        setEmailError('No super admin account found with that email.');
        return false;
      }
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        'No super admin account found with that email.';
      setEmailValid(false);
      setEmailError(msg);
      return false;
    } finally {
      setEmailChecking(false);
    }
  };

  const handleEmailChange = (val) => {
    setEmail(val);
    setEmailValid(null);
    setEmailError('');
    clearTimeout(debounceRef.current);
    if (!val) return;
    debounceRef.current = setTimeout(() => checkEmail(val), 600);
  };

  const handleManualLogin = async (e) => {
    e.preventDefault();
    let valid = emailValid;
    if (valid === null && email) {
      valid = await checkEmail(email);
    }
    if (!valid) {
      setEmailError('No super admin account found with that email.');
      return;
    }
    setSlowConnection(false);
    const slowTimer = setTimeout(() => setSlowConnection(true), 8000);
    try {
      const data = await fetchData('auth/sign-in', {
        method: 'POST',
        data: { email, password, type: 'login', platform: 'website' },
      });
      clearTimeout(slowTimer);
      sessionStorage.setItem('otp_access', 'true');
      sessionStorage.setItem('otp_type', 'login');
      sessionStorage.setItem('email', email);
      navigate('/otp-verification');
    } catch {
      clearTimeout(slowTimer);
      setSlowConnection(false);
    }
  };

  const login = useGoogleLogin({
    onSuccess: async ({ access_token }) => {
      setGoogleError('');
      try {
        const data = await fetchData('auth/google', {
          method: 'POST',
          data: { access_token, type: 'login' },
        });
        sessionStorage.setItem('otp_access', 'true');
        sessionStorage.setItem('otp_type', 'login');
        sessionStorage.setItem('email', data.email);
        navigate('/otp-verification');
      } catch (err) {
        setGoogleError(
          err.response?.data?.error ||
            'No super admin account found with that Google account.',
        );
      }
    },
    onError: () => setGoogleError('Google sign in failed. Please try again.'),
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

          {/* Toast */}
          {passwordReset && (
            <div className='mb-6 flex items-center gap-3 bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3 rounded-xl'>
              <CheckCircle size={16} className='shrink-0' />
              Password reset successfully. Please sign in.
            </div>
          )}

          <div className='bg-white rounded-2xl border border-gray-200 p-8'>
            <div className='mb-7'>
              <h1 className='font-bold text-2xl text-gray-800'>Welcome back</h1>
              <p className='text-gray-400 text-sm mt-1'>
                Sign in to your Super Admin account
              </p>
            </div>

            <form onSubmit={handleManualLogin} className='flex flex-col gap-5'>
              {/* Email */}
              <div className='flex flex-col gap-1.5'>
                <label className='text-xs font-semibold text-gray-500 uppercase tracking-wide'>
                  Email Address
                </label>
                <div
                  className={`flex items-center gap-3 border rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-blue-100 transition bg-gray-50 ${
                    emailValid === false
                      ? 'border-red-300 focus-within:border-red-400'
                      : emailValid === true
                        ? 'border-green-300 focus-within:border-green-400'
                        : 'border-gray-200 focus-within:border-blue-400'
                  }`}
                >
                  <Mail size={16} className='text-gray-400 shrink-0' />
                  <input
                    type='text'
                    value={email}
                    onChange={(e) => handleEmailChange(e.target.value)}
                    className='flex-1 bg-transparent outline-none text-sm text-gray-800 placeholder-gray-400'
                    placeholder='admin@gmail.com'
                  />
                  {emailChecking && (
                    <Loader2
                      size={15}
                      className='text-gray-400 animate-spin shrink-0'
                    />
                  )}
                  {!emailChecking && emailValid === true && (
                    <CheckCircle
                      size={15}
                      className='text-green-500 shrink-0'
                    />
                  )}
                  {!emailChecking && emailValid === false && (
                    <XCircle size={15} className='text-red-400 shrink-0' />
                  )}
                </div>
                {emailError && (
                  <p className='text-xs text-red-500'>{emailError}</p>
                )}
              </div>

              {/* Password */}
              <div className='flex flex-col gap-1.5'>
                <label className='text-xs font-semibold text-gray-500 uppercase tracking-wide'>
                  Password
                </label>
                <div className='flex items-center gap-3 border border-gray-200 rounded-xl px-4 py-3 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 transition bg-gray-50'>
                  <Lock size={16} className='text-gray-400 shrink-0' />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className='flex-1 bg-transparent outline-none text-sm text-gray-800 placeholder-gray-400'
                    placeholder='••••••••'
                  />
                  <button
                    type='button'
                    onClick={() => setShowPassword(!showPassword)}
                    className='text-gray-400 hover:text-gray-600 transition'
                  >
                    {showPassword ? <Eye size={16} /> : <EyeOff size={16} />}
                  </button>
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
                {loading
                  ? slowConnection
                    ? 'Waking up server...'
                    : 'Verifying...'
                  : 'Sign In'}
              </button>

              {/* Divider */}
              <div className='flex items-center gap-3'>
                <div className='flex-1 h-px bg-gray-200' />
                <span className='text-xs text-gray-400'>or continue with</span>
                <div className='flex-1 h-px bg-gray-200' />
              </div>

              {/* Google */}
              <div className='flex flex-col gap-1.5'>
                <button
                  type='button'
                  onClick={() => login()}
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
                {googleError && (
                  <p className='text-xs text-red-500 text-center'>
                    {googleError}
                  </p>
                )}
              </div>
            </form>

            <div className='mt-6 flex flex-col gap-2 text-center text-sm text-gray-400'>
              {/* {!superAdminExists && (
                <p>Don't have an account?{' '}
                  <Link to='/sign-up' className='text-blue-600 font-medium hover:underline'>Sign up</Link>
                </p>
              )} */}
              <p>
                Don't have an account?{' '}
                <Link
                  to='/sign-up'
                  className='text-blue-600 font-medium hover:underline'
                >
                  Sign up
                </Link>
              </p>
              <p>
                Can't sign in?{' '}
                <Link
                  to='/account-recovery'
                  className='text-blue-600 font-medium hover:underline'
                >
                  Get help
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
