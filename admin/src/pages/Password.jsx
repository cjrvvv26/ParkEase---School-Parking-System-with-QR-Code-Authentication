import { useState } from 'react';
import { useSelector } from 'react-redux';
import bcrypt from 'bcryptjs';
import { Eye, EyeClosed } from 'lucide-react';
import useFetch from '../hooks/useFetch';
import { useNavigate } from 'react-router-dom';
import useDark from '../hooks/useDark';

export default function Password() {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const { fetchData, loading } = useFetch();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState({ current: false, new: false, confirm: false });
  const { dark, input, border } = useDark();

  if (!user) return <p className='p-5 text-gray-400 text-center'>Loading profile...</p>;

  const handleChangePassword = async () => {
    if (!newPassword || !confirmPassword || !currentPassword) { alert('Please fill in all password fields!'); return; }
    if (!bcrypt.compareSync(currentPassword, user.password)) { alert('Current password is incorrect!'); return; }
    if (newPassword !== confirmPassword) { alert('New passwords do not match!'); return; }
    const data = await fetchData('super-admin/update-password', { method: 'PATCH', data: { password: newPassword }, timeout: 5000 });
    if (data) { alert('Password updated successfully!'); navigate('/account-details'); }
  };

  const toggle = (field) => setShowPassword((p) => ({ ...p, [field]: !p[field] }));

  const fields = [
    { label: 'Current Password', key: 'current', value: currentPassword, set: setCurrentPassword },
    { label: 'New Password', key: 'new', value: newPassword, set: setNewPassword },
    { label: 'Confirm New Password', key: 'confirm', value: confirmPassword, set: setConfirmPassword },
  ];

  return (
    <div className='ml-5 mt-5 self-start pb-10'>
      <h1 className={`text-3xl font-bold ${dark ? 'text-gray-100' : 'text-gray-700'}`}>Change Password</h1>
      <p className={`text-sm mb-5 ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
        Update your password for account: <span className='font-medium'>{user?.username}</span>
      </p>
      <div className='space-y-4'>
        {fields.map(({ label, key, value, set }) => (
          <div key={key} className='relative'>
            <label className={`block text-sm mb-1 ${dark ? 'text-gray-400' : 'text-gray-600'}`}>{label}</label>
            <input
              type={showPassword[key] ? 'text' : 'password'}
              value={value}
              onChange={(e) => set(e.target.value)}
              className={`w-full px-3 py-2 rounded-md border outline-none focus:ring-2 focus:ring-violet-500 ${input}`}
              placeholder={`Enter ${label.toLowerCase()}`}
            />
            {showPassword[key]
              ? <Eye strokeWidth={1.5} className='absolute right-3 top-8 cursor-pointer text-gray-400' onClick={() => toggle(key)} />
              : <EyeClosed strokeWidth={1.5} className='absolute right-3 top-8 cursor-pointer text-gray-400' onClick={() => toggle(key)} />
            }
          </div>
        ))}
      </div>
      <button disabled={loading} onClick={handleChangePassword} className='mt-6 w-full px-4 py-2 bg-violet-600 text-white font-medium rounded-md hover:bg-violet-700 transition disabled:opacity-60'>
        {loading ? 'Updating...' : 'Change Password'}
      </button>
    </div>
  );
}
