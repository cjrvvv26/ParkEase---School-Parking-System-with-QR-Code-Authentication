import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import useFetch from '../hooks/useFetch';
import axiosConfig from '../utils/axiosConfig';
import { useDispatch } from 'react-redux';
import { login } from '../features/authSlice';
import Logo from '../assets/images/urs-logo.jpg';
import { Mail, RotateCcw, X, ShieldCheck } from 'lucide-react';

export default function EmailConfirmation() {
  const navigate = useNavigate();
  const [otp, setOtp] = useState(new Array(6).fill(''));
  const [email, setEmail] = useState(null);
  const [otpType, setOtpType] = useState(null);
  const inputRef = useRef([]);
  const { error, setError, loading, fetchData } = useFetch();
  const [cancel, setCancel] = useState(false);
  const [timer, setTimer] = useState(60);
  const dispatch = useDispatch();

  useEffect(() => {
    const otp_access = sessionStorage.getItem('otp_access');
    setEmail(sessionStorage.getItem('email'));
    setOtpType(sessionStorage.getItem('otp_type'));
    if (!otp_access) navigate('/sign-in');
  }, []);

  useEffect(() => {
    if (timer === 0) return;
    const interval = setInterval(() => setTimer((p) => p - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const handleChange = (value, index) => {
    if (/^[0-9]$/.test(value) || value === '') {
      let newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      if (value !== '' && index < otp.length - 1)
        inputRef.current[index + 1].focus();
      if (newOtp.every((d) => d !== '')) {
        const convertedOtp = Number(newOtp.join(''));
        (async () => {
          try {
            const data = await fetchData('auth/verify-otp', {
              method: 'POST',
              data: {
                email,
                inputOtp: convertedOtp,
                type: otpType,
                platform: 'website',
              },
            });
            sessionStorage.removeItem('otp_access');
            sessionStorage.removeItem('otp_type');
            sessionStorage.removeItem('email');
            dispatch(login(data));
            navigate('/dashboard');
          } catch (err) {
            setOtp(new Array(6).fill(''));
            inputRef.current[0]?.focus();
          }
        })();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace') {
      let newOtp = [...otp];
      if (otp[index] !== '') {
        newOtp[index] = '';
        setOtp(newOtp);
      } else if (index > 0) {
        inputRef.current[index - 1].focus();
        newOtp[index - 1] = '';
        setOtp(newOtp);
      }
    }
  };

  const handleResendOtp = async () => {
    try {
      await fetchData('/auth/resend-otp', {
        method: 'POST',
        data: { email, type: otpType },
      });
      setError('');
      setTimer(60);
      setOtp(new Array(6).fill(''));
      inputRef.current[0]?.focus();
    } catch {}
  };

  const handleCancel = async () => {
    try {
      setCancel(true);
      await axiosConfig.delete('super-admin/auth/cancel-verification', {
        data: { email },
      });
      sessionStorage.removeItem('otp_access');
      sessionStorage.removeItem('otp_type');
      sessionStorage.removeItem('email');
      navigate('/sign-in');
    } catch {
    } finally {
      setCancel(false);
    }
  };

  const maskedEmail = email
    ? email.replace(
        /(.{2})(.*)(@.*)/,
        (_, a, b, c) => a + '*'.repeat(Math.min(b.length, 6)) + c,
      )
    : '';

  return (
    <div className='min-h-screen w-full flex'>
      {/* Left branding panel */}
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
          <div className='mt-2 bg-white/10 rounded-2xl px-6 py-5 w-full max-w-xs flex flex-col items-center gap-3'>
            <div className='p-3 bg-white/20 rounded-full'>
              <ShieldCheck size={28} className='text-white' />
            </div>
            <p className='text-white font-semibold text-base'>
              Two-Step Verification
            </p>
            <p className='text-blue-100 text-sm leading-relaxed'>
              We sent a 6-digit code to your email. Enter it to verify your
              identity and access the system.
            </p>
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

          <div className='bg-white rounded-2xl shadow-sm border border-gray-200 p-8'>
            {/* Header */}
            <div className='flex flex-col items-center text-center gap-3 mb-8'>
              <div className='p-4 bg-blue-50 rounded-2xl'>
                <Mail size={28} className='text-blue-600' />
              </div>
              <div>
                <h1 className='font-bold text-2xl text-gray-800'>
                  Check your email
                </h1>
                <p className='text-gray-400 text-sm mt-1'>
                  We sent a 6-digit code to
                </p>
                <p className='text-blue-600 font-semibold text-sm mt-0.5'>
                  {maskedEmail}
                </p>
              </div>
            </div>

            {/* OTP inputs */}
            <div className='flex gap-3 justify-center mb-6'>
              {otp.map((digit, index) => (
                <input
                  key={index}
                  type='text'
                  inputMode='numeric'
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(e.target.value, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  ref={(el) => (inputRef.current[index] = el)}
                  className={`w-12 h-14 text-center text-xl font-bold rounded-xl border-2 outline-none transition
                    ${digit ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 bg-gray-50 text-gray-800'}
                    focus:border-blue-400 focus:ring-2 focus:ring-blue-100`}
                />
              ))}
            </div>

            {/* Loading indicator */}
            {loading && (
              <div className='flex items-center justify-center gap-2 mb-4'>
                <div className='w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin' />
                <p className='text-sm text-blue-500'>Verifying...</p>
              </div>
            )}

            {/* Error */}
            {error && (
              <div className='flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-4'>
                <X size={14} className='text-red-500 shrink-0' />
                <p className='text-xs text-red-600'>{error}</p>
              </div>
            )}

            {/* Timer / Resend */}
            <div className='flex flex-col items-center gap-3'>
              {timer > 0 ? (
                <div className='flex items-center gap-2 text-sm text-gray-400'>
                  <div className='w-5 h-5 rounded-full border-2 border-gray-200 flex items-center justify-center'>
                    <span className='text-[10px] font-bold text-gray-500'>
                      {timer}
                    </span>
                  </div>
                  Resend code
                </div>
              ) : (
                <button
                  onClick={handleResendOtp}
                  disabled={loading}
                  className='flex items-center gap-2 text-sm text-blue-600 font-semibold hover:text-blue-700 transition disabled:opacity-50'
                >
                  <RotateCcw size={14} />
                  Resend code
                </button>
              )}

              <div className='w-full h-px bg-gray-100 my-1' />

              <button
                disabled={cancel}
                onClick={handleCancel}
                className='flex items-center gap-2 text-sm text-gray-400 hover:text-gray-600 transition disabled:opacity-50'
              >
                <X size={14} />
                {cancel ? 'Cancelling...' : 'Cancel verification'}
              </button>
            </div>
          </div>

          <p className='text-center text-xs text-gray-400 mt-4'>
            Didn't receive the email? Check your spam folder.
          </p>
        </div>
      </div>
    </div>
  );
}
