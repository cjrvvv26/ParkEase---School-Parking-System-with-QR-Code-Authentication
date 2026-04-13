import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Eye, EyeOff, Lock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import useFetch from '../hooks/useFetch';
import { useNavigate } from 'react-router-dom';
import useDark from '../hooks/useDark';

const RULES = [
  { key: 'length', label: 'At least 8 characters', test: (p) => p.length >= 8 },
  { key: 'upper', label: 'One uppercase letter', test: (p) => /[A-Z]/.test(p) },
  { key: 'number', label: 'One number', test: (p) => /[0-9]/.test(p) },
  { key: 'special', label: 'One special character', test: (p) => /[^A-Za-z0-9]/.test(p) },
];

export default function Password() {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const { fetchData, loading } = useFetch();
  const { dark, input, border } = useDark();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [show, setShow] = useState({ current: false, new: false, confirm: false });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  if (!user) return <p className='p-5 text-gray-400 text-center'>Loading profile...</p>;

  const toggle = (field) => setShow((p) => ({ ...p, [field]: !p[field] }));

  const ruleResults = RULES.map((r) => ({ ...r, pass: r.test(newPassword) }));
  const allRulesPassed = ruleResults.every((r) => r.pass);
  const confirmMatch = confirmPassword.length > 0 && confirmPassword === newPassword;
  const canSubmit = currentPassword && allRulesPassed && confirmMatch;

  const validate = () => {
    const e = {};
    if (!currentPassword) e.current = 'Current password is required.';
    if (!newPassword) e.new = 'New password is required.';
    else if (!allRulesPassed) e.new = 'Password does not meet all requirements.';
    if (!confirmPassword) e.confirm = 'Please confirm your new password.';
    else if (confirmPassword !== newPassword) e.confirm = 'Passwords do not match.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChangePassword = async () => {
    if (!validate()) return;
    setErrors({});
    try {
      const data = await fetchData('super-admin/update-password', {
        method: 'PATCH',
        data: { password: newPassword, currentPassword },
        timeout: 5000,
      });
      if (data) {
        setSuccess(true);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (err) {
      const msg = err?.response?.data?.error || 'Failed to update password. Please try again.';
      setErrors({ server: msg });
    }
  };

  if (success) {
    return (
      <div className='ml-5 mt-5 self-start pb-10 max-w-md'>
        <div className={`flex flex-col items-center gap-4 p-8 rounded-2xl border ${dark ? 'bg-[#2f2f2f] border-[#3a3a3a]' : 'bg-white border-gray-200'}`}>
          <div className='p-4 rounded-full bg-green-100'>
            <CheckCircle size={36} className='text-green-500' />
          </div>
          <h2 className={`text-xl font-bold ${dark ? 'text-gray-100' : 'text-gray-800'}`}>Password Updated!</h2>
          <p className={`text-sm text-center ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
            Your password has been changed successfully.
          </p>
          <button
            onClick={() => navigate('/account-details')}
            className='mt-2 px-6 py-2.5 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition'
          >
            Back to Profile
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className='ml-5 mt-5 self-start pb-10 max-w-md'>
      <h1 className={`text-3xl font-bold ${dark ? 'text-gray-100' : 'text-gray-700'}`}>Change Password</h1>
      <p className={`text-sm mb-6 ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
        Update your password for account: <span className='font-medium'>{user?.username}</span>
      </p>

      {/* Server error */}
      {errors.server && (
        <div className='flex items-center gap-2.5 mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200'>
          <AlertCircle size={16} className='text-red-500 shrink-0' />
          <p className='text-sm text-red-600'>{errors.server}</p>
        </div>
      )}

      <div className='space-y-5'>
        {/* Current Password */}
        <div>
          <label className={`block text-sm font-medium mb-1.5 ${dark ? 'text-gray-300' : 'text-gray-600'}`}>
            Current Password
          </label>
          <div className={`flex items-center gap-2 border rounded-xl px-3.5 py-2.5 transition ${errors.current ? 'border-red-400 bg-red-50' : `${dark ? 'border-[#3a3a3a] bg-[#3a3a3a]' : 'border-gray-200 bg-gray-50'} focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100'`}`}>
            <Lock size={15} className='text-gray-400 shrink-0' />
            <input
              type={show.current ? 'text' : 'password'}
              value={currentPassword}
              onChange={(e) => { setCurrentPassword(e.target.value); setErrors((p) => ({ ...p, current: '' })); }}
              className='flex-1 bg-transparent outline-none text-sm placeholder-gray-400'
              placeholder='Enter current password'
            />
            <button type='button' onClick={() => toggle('current')} className='text-gray-400 hover:text-gray-600'>
              {show.current ? <Eye size={15} /> : <EyeOff size={15} />}
            </button>
          </div>
          {errors.current && <p className='text-xs text-red-500 mt-1 flex items-center gap-1'><XCircle size={11} />{errors.current}</p>}
        </div>

        {/* New Password */}
        <div>
          <label className={`block text-sm font-medium mb-1.5 ${dark ? 'text-gray-300' : 'text-gray-600'}`}>
            New Password
          </label>
          <div className={`flex items-center gap-2 border rounded-xl px-3.5 py-2.5 transition ${errors.new ? 'border-red-400 bg-red-50' : `${dark ? 'border-[#3a3a3a] bg-[#3a3a3a]' : 'border-gray-200 bg-gray-50'} focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100`}`}>
            <Lock size={15} className='text-gray-400 shrink-0' />
            <input
              type={show.new ? 'text' : 'password'}
              value={newPassword}
              onChange={(e) => { setNewPassword(e.target.value); setErrors((p) => ({ ...p, new: '' })); }}
              className='flex-1 bg-transparent outline-none text-sm placeholder-gray-400'
              placeholder='Enter new password'
            />
            <button type='button' onClick={() => toggle('new')} className='text-gray-400 hover:text-gray-600'>
              {show.new ? <Eye size={15} /> : <EyeOff size={15} />}
            </button>
          </div>
          {errors.new && <p className='text-xs text-red-500 mt-1 flex items-center gap-1'><XCircle size={11} />{errors.new}</p>}

          {/* Password rules */}
          {newPassword.length > 0 && (
            <div className={`mt-2.5 p-3 rounded-xl grid grid-cols-2 gap-1.5 ${dark ? 'bg-[#3a3a3a]' : 'bg-gray-50'} border ${dark ? 'border-[#4a4a4a]' : 'border-gray-200'}`}>
              {ruleResults.map((r) => (
                <div key={r.key} className='flex items-center gap-1.5'>
                  {r.pass
                    ? <CheckCircle size={12} className='text-green-500 shrink-0' />
                    : <XCircle size={12} className='text-gray-300 shrink-0' />}
                  <span className={`text-xs ${r.pass ? 'text-green-600' : dark ? 'text-gray-400' : 'text-gray-400'}`}>{r.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label className={`block text-sm font-medium mb-1.5 ${dark ? 'text-gray-300' : 'text-gray-600'}`}>
            Confirm New Password
          </label>
          <div className={`flex items-center gap-2 border rounded-xl px-3.5 py-2.5 transition ${
            confirmPassword.length > 0
              ? confirmMatch ? 'border-green-400 bg-green-50' : 'border-red-400 bg-red-50'
              : `${dark ? 'border-[#3a3a3a] bg-[#3a3a3a]' : 'border-gray-200 bg-gray-50'} focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100`
          }`}>
            <Lock size={15} className={`shrink-0 ${confirmPassword.length > 0 ? confirmMatch ? 'text-green-500' : 'text-red-400' : 'text-gray-400'}`} />
            <input
              type={show.confirm ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => { setConfirmPassword(e.target.value); setErrors((p) => ({ ...p, confirm: '' })); }}
              className='flex-1 bg-transparent outline-none text-sm placeholder-gray-400'
              placeholder='Confirm new password'
            />
            <button type='button' onClick={() => toggle('confirm')} className='text-gray-400 hover:text-gray-600'>
              {show.confirm ? <Eye size={15} /> : <EyeOff size={15} />}
            </button>
          </div>
          {confirmPassword.length > 0 && (
            <p className={`text-xs mt-1 flex items-center gap-1 ${confirmMatch ? 'text-green-600' : 'text-red-500'}`}>
              {confirmMatch ? <CheckCircle size={11} /> : <XCircle size={11} />}
              {confirmMatch ? 'Passwords match' : 'Passwords do not match'}
            </p>
          )}
          {errors.confirm && !confirmPassword.length && <p className='text-xs text-red-500 mt-1 flex items-center gap-1'><XCircle size={11} />{errors.confirm}</p>}
        </div>
      </div>

      <button
        disabled={loading}
        onClick={handleChangePassword}
        className='mt-6 w-full px-4 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition disabled:opacity-60 disabled:cursor-not-allowed'
      >
        {loading ? 'Updating...' : 'Change Password'}
      </button>
    </div>
  );
}
