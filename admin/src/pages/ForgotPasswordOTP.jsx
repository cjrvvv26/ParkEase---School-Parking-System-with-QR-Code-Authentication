import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useFetch from '../hooks/useFetch';
import { ShieldCheck } from 'lucide-react';

export default function ForgotPasswordOTP() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(new Array(6).fill(''));
  const [timer, setTimer] = useState(60);
  const inputRef = useRef([]);
  const { error, setError, loading, fetchData } = useFetch();

  useEffect(() => {
    const fp_email = sessionStorage.getItem('fp_email');
    if (!fp_email) { navigate('/account-recovery'); return; }
    setEmail(fp_email);
  }, []);

  useEffect(() => {
    if (timer === 0) return;
    const id = setInterval(() => setTimer((p) => p - 1), 1000);
    return () => clearInterval(id);
  }, [timer]);

  const handleChange = (value, index) => {
    if (!/^[0-9]$/.test(value) && value !== '') return;
    const next = [...otp];
    next[index] = value;
    setOtp(next);
    if (value && index < 5) inputRef.current[index + 1]?.focus();
    if (next.every((d) => d !== '')) verify(next.join(''));
  };

  const handleKeyDown = (e, index) => {
    if (e.key !== 'Backspace') return;
    const next = [...otp];
    if (next[index]) { next[index] = ''; setOtp(next); }
    else if (index > 0) { inputRef.current[index - 1]?.focus(); next[index - 1] = ''; setOtp(next); }
  };

  const verify = async (code) => {
    const data = await fetchData('/auth/forgot-password/verify-otp', {
      method: 'POST',
      data: { email, otp: code },
    }).catch(() => { setOtp(new Array(6).fill('')); inputRef.current[0]?.focus(); });
    if (data?.resetToken) {
      sessionStorage.setItem('fp_reset_token', data.resetToken);
      navigate('/forgot-password/reset');
    }
  };

  const handleResend = async () => {
    await fetchData('/auth/forgot-password/send-otp', { method: 'POST', data: { email } }).catch(() => {});
    setError('');
    setTimer(60);
    setOtp(new Array(6).fill(''));
    inputRef.current[0]?.focus();
  };

  const handleCancel = () => {
    sessionStorage.removeItem('fp_email');
    navigate('/account-recovery');
  };

  return (
    <div className='min-h-screen w-full bg-white flex items-center justify-center text-gray-900'>
      <div className='w-[420px] flex flex-col gap-6'>
        {/* Header */}
        <div className='flex flex-col items-center gap-1 mb-2'>
          <div className='h-14 w-14 rounded-full bg-violet-100 flex items-center justify-center mb-2'>
            <ShieldCheck className='text-violet-500' strokeWidth={1.5} size={26} />
          </div>
          <h1 className='text-2xl font-bold'>Check Your Email</h1>
          <p className='text-sm text-gray-400 text-center'>
            We sent a 6-digit code to <span className='font-medium text-gray-600'>{email}</span>
          </p>
        </div>

        {/* OTP inputs */}
        <div className='flex gap-3 justify-center'>
          {otp.map((digit, i) => (
            <input
              key={i}
              type='text'
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(e.target.value, i)}
              onKeyDown={(e) => handleKeyDown(e, i)}
              ref={(el) => (inputRef.current[i] = el)}
              disabled={loading}
              className='text-center text-xl font-semibold ring ring-gray-300 focus:ring-2 focus:ring-violet-500 rounded-xl w-14 h-14 outline-none disabled:opacity-50'
            />
          ))}
        </div>

        {error && <p className='text-xs text-red-500 text-center'>{error}</p>}
        {loading && <p className='text-xs text-violet-500 text-center'>Verifying...</p>}

        {/* Resend */}
        <button
          disabled={timer > 0 || loading}
          onClick={handleResend}
          className={`p-4 rounded-xl text-sm font-medium transition-colors ${
            timer <= 0 && !loading
              ? 'bg-violet-500 hover:bg-violet-600 text-white'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
        >
          {timer > 0 ? `Resend code in ${timer}s` : 'Resend Code'}
        </button>

        <button
          onClick={handleCancel}
          className='p-4 rounded-xl border border-gray-200 text-sm text-gray-500 hover:bg-gray-50 transition-colors'
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
