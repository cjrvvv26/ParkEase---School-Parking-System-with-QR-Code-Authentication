import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, KeyRound, Check, X } from 'lucide-react';
import useFetch from '../hooks/useFetch';

const rules = [
  { label: 'At least 8 characters', test: (p) => p.length >= 8 },
  { label: 'One uppercase letter', test: (p) => /[A-Z]/.test(p) },
  { label: 'One number', test: (p) => /[0-9]/.test(p) },
  { label: 'One special character', test: (p) => /[^A-Za-z0-9]/.test(p) },
];

export default function ResetPassword() {
  const navigate = useNavigate();
  const { loading, fetchData } = useFetch();
  const [email, setEmail] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState({ new: false, confirm: false });
  const [touched, setTouched] = useState(false);
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    const fp_email = sessionStorage.getItem('fp_email');
    const fp_token = sessionStorage.getItem('fp_reset_token');
    if (!fp_email || !fp_token) { navigate('/account-recovery'); return; }
    setEmail(fp_email);
    setResetToken(fp_token);
  }, []);

  const allRulesPassed = rules.every((r) => r.test(password));
  const passwordsMatch = password === confirm && confirm !== '';
  const canSubmit = allRulesPassed && passwordsMatch && !loading;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched(true);
    setSubmitError('');
    if (!canSubmit) return;

    const data = await fetchData('/auth/forgot-password/reset', {
      method: 'PATCH',
      data: { email, resetToken, password },
    }).catch((err) => { setSubmitError(err?.response?.data?.error || 'Something went wrong'); });

    if (data?.message === 'Password reset successfully') {
      sessionStorage.removeItem('fp_email');
      sessionStorage.removeItem('fp_reset_token');
      navigate('/sign-in', { replace: true, state: { passwordReset: true } });
    }
  };

  return (
    <div className='min-h-screen w-full bg-white flex items-center justify-center text-gray-900'>
      <div className='w-[420px] flex flex-col gap-6'>
        {/* Header */}
        <div className='flex flex-col items-center gap-1 mb-2'>
          <div className='h-14 w-14 rounded-full bg-blue-100 flex items-center justify-center mb-2'>
            <KeyRound className='text-blue-500' strokeWidth={1.5} size={26} />
          </div>
          <h1 className='text-2xl font-bold'>Reset Password</h1>
          <p className='text-sm text-gray-400 text-center'>
            Create a strong new password for your account.
          </p>
        </div>

        <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
          {/* New password */}
          <div className='flex flex-col gap-1'>
            <label className='text-xs text-gray-500 font-medium'>New Password</label>
            <div className='relative'>
              <input
                type={showPassword.new ? 'text' : 'password'}
                value={password}
                onChange={(e) => { setPassword(e.target.value); setTouched(true); }}
                className='w-full p-4 pr-12 rounded-xl ring ring-gray-300 hover:ring-blue-400 focus:ring-2 focus:ring-blue-500 outline-none text-sm'
                placeholder='Enter new password'
              />
              <button type='button' onClick={() => setShowPassword((p) => ({ ...p, new: !p.new }))}
                className='absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600'>
                {showPassword.new ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Password rules */}
          {(touched || password) && (
            <div className='grid grid-cols-2 gap-1.5'>
              {rules.map((r) => {
                const pass = r.test(password);
                return (
                  <div key={r.label} className={`flex items-center gap-1.5 text-xs ${pass ? 'text-green-600' : 'text-gray-400'}`}>
                    {pass
                      ? <Check size={12} className='flex-shrink-0' />
                      : <X size={12} className='flex-shrink-0' />}
                    {r.label}
                  </div>
                );
              })}
            </div>
          )}

          {/* Confirm password */}
          <div className='flex flex-col gap-1'>
            <label className='text-xs text-gray-500 font-medium'>Confirm Password</label>
            <div className='relative'>
              <input
                type={showPassword.confirm ? 'text' : 'password'}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className={`w-full p-4 pr-12 rounded-xl ring outline-none text-sm transition-colors ${
                  touched && confirm
                    ? passwordsMatch
                      ? 'ring-green-400 focus:ring-2 focus:ring-green-500'
                      : 'ring-red-400 focus:ring-2 focus:ring-red-500'
                    : 'ring-gray-300 hover:ring-blue-400 focus:ring-2 focus:ring-blue-500'
                }`}
                placeholder='Confirm new password'
              />
              <button type='button' onClick={() => setShowPassword((p) => ({ ...p, confirm: !p.confirm }))}
                className='absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600'>
                {showPassword.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {touched && confirm && !passwordsMatch && (
              <p className='text-xs text-red-500'>Passwords do not match</p>
            )}
            {touched && confirm && passwordsMatch && (
              <p className='text-xs text-green-600'>Passwords match</p>
            )}
          </div>

          {submitError && <p className='text-xs text-red-500'>{submitError}</p>}

          <button
            type='submit'
            disabled={!canSubmit}
            className={`p-4 rounded-xl text-sm font-medium transition-colors mt-1 ${
              canSubmit
                ? 'bg-blue-500 hover:bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
      </div>
    </div>
  );
}
