import { useEffect } from 'react';
import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import useFetch from '../hooks/useFetch';
import axiosConfig from '../utils/axiosConfig';
import { useDispatch } from 'react-redux';
import { login } from '../features/authSlice';

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
  //Check if the user already input email
  useEffect(() => {
    const otp_access = sessionStorage.getItem('otp_access');
    setEmail(sessionStorage.getItem('email'));
    setOtpType(sessionStorage.getItem('otp_type'));
    if (!otp_access) {
      navigate('/sign-in');
    }
  }, []);

  useEffect(() => {
    if (timer === 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  //Handle digit updates
  const handleChange = (value, index) => {
    if (/^[0-9]$/.test(value) || value === '') {
      let newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value !== '' && index < otp.length - 1) {
        inputRef.current[index + 1].focus();
      }

      //It checks if all inputs have digits
      if (newOtp.every((digit) => digit !== '')) {
        const convertedOtp = Number(newOtp.join(''));
        console.log(convertedOtp);

        const handleOtpVerification = async () => {
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
          } catch (error) {
            setOtp(new Array(6).fill(''));
            newOtp = [...otp];
            console.log(error.response.data.error);
          }
        };
        handleOtpVerification();
      }
    }
  };

  //Handle remove digits every backspace
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

  //Handle resend otp
  const handleResendOtp = async () => {
    try {
      const data = await fetchData('/auth/resend-otp', {
        method: 'POST',
        data: { email, type: otpType },
      });
      console.log(data);
      setError('');
      setTimer(60);
    } catch (error) {
      console.log(error.response);
    }
  };

  //Handle Verification Cancellation
  const handelCancelVerification = async () => {
    try {
      setCancel(true);
      await axiosConfig.delete(
        'super-admin/auth/cancel-verification',
        { data: { email } },
      );
      sessionStorage.removeItem('otp_access');
      sessionStorage.removeItem('otp_type');
      sessionStorage.removeItem('email');
      navigate('/sign-in');
    } catch (error) {
      console.log(error.response?.data);
    } finally {
      setCancel(false);
    }
  };
  return (
    <div className='min-h-screen text-sm text-gray-900 bg-white  flex flex-col items-center justify-center '>
      <div className='w-[450px]'>
        <div className='flex flex-col gap-3 items-center mb-10'>
          <h1 className='font-bold text-3xl'>Email Verification</h1>
          <h2>You need to input your One Time Password (OTP).</h2>
        </div>
        {/* Digit inputs */}
        <div className='flex gap-3 w-[450px] justify-center items-center mb-5'>
          {otp.map((digit, index) => (
            <input
              key={index}
              type='text'
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(e.target.value, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              ref={(el) => (inputRef.current[index] = el)}
              readOnly={(index > 0 && !otp[index - 1]) || otp[index] !== ''}
              className={`${
                (index > 0 && !otp[index - 1]) || otp[index] !== ''
                  ? ''
                  : 'focus:ring-blue-400 focus:ring-2'
              } text-center text-xl ring font-medium ring-gray-400 rounded-lg w-12 h-12 outline-none`}
            />
          ))}
        </div>
        <button
          disabled={timer > 0}
          onClick={handleResendOtp}
          className={`${
            timer <= 0
              ? 'bg-blue-500 hover:bg-blue-400'
              : 'bg-gray-400 hover:bg-gray-500'
          } p-4 w-full mb-1 rounded-lg 
text-white duration-75 flex items-center gap-2 justify-center`}
        >
          {loading ? (
            <p className='text-white'>Sending...</p>
          ) : (
            <>
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
                  d='M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75'
                />
              </svg>

              <p>Resend OTP</p>
            </>
          )}
        </button>
        <div className='w-full mb-5'>
          <p className='text-xs text-red-500 text-left'>
            {error && typeof error === 'string' ? error : ''}
          </p>
          {timer > 0 && (
            <p className='text-xs text-gray-400 text-left'>
              You can resend otp in: {timer}
            </p>
          )}
        </div>
        <button
          disabled={cancel}
          onClick={handelCancelVerification}
          className='border-gray-400 text-gray-400 border rounded-lg p-4 w-full items-center justify-center'
        >
          {cancel ? 'Cancelling...' : 'Cancel'}
        </button>
      </div>
    </div>
  );
}
