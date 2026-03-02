import { useState } from 'react';
import { useSelector } from 'react-redux';
import bcrypt from 'bcryptjs';
import { Eye, EyeClosed } from 'lucide-react';
import useFetch from '../hooks/useFetch';
import { useNavigate } from 'react-router-dom';

export default function Password() {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const { fetchData, loading, error } = useFetch();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  if (!user) {
    return <p className='p-5 text-gray-400 text-center'>Loading profile...</p>;
  }

  const handleChangePassword = async () => {
    if (!newPassword || !confirmPassword || !currentPassword) {
      alert('Please fill in all password fields!');
      return;
    }

    if (!bcrypt.compareSync(currentPassword, user.password)) {
      alert('Current password is incorrect!');
      return;
    }

    if (newPassword !== confirmPassword) {
      alert('New passwords do not match!');
      return;
    }

    const data = await fetchData('super-admin/update-password', {
      method: 'PATCH',
      data: { password: newPassword },
      timeout: 5000,
    });

    if (data) {
      alert('Password updated successfully!');
      navigate('/account-details');
    }
  };

  return (
    <div className='ml-5 mt-5 self-start'>
      {/* Header */}
      <h1 className='text-3xl font-bold text-gray-700'>Change Password</h1>
      <p className='text-sm text-gray-500 mb-5'>
        Update your password for account:{' '}
        <span className='font-medium'>{user?.username}</span>
      </p>

      {/* Password Fields */}
      <div className='space-y-4'>
        <div className='relative'>
          <label className='block text-sm text-gray-600 mb-1'>
            Current Password
          </label>
          <input
            type={showPassword.current ? 'text' : 'password'}
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className='w-full px-3 py-2 rounded-md border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-violet-500'
            placeholder='Enter current password'
          />
          {showPassword.current ? (
            <Eye
              strokeWidth={1.5}
              className='absolute right-3 top-8 cursor-pointer text-gray-400'
              onClick={() =>
                setShowPassword((prev) => ({
                  ...prev,
                  current: !prev.current,
                }))
              }
            />
          ) : (
            <EyeClosed
              strokeWidth={1.5}
              className='absolute right-3 top-8 cursor-pointer text-gray-400'
              onClick={() =>
                setShowPassword((prev) => ({
                  ...prev,
                  current: !prev.current,
                }))
              }
            />
          )}
        </div>

        <div className='relative'>
          <label className='block text-sm text-gray-600 mb-1'>
            New Password
          </label>
          <input
            type={showPassword.new ? 'text' : 'password'}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className='w-full px-3 py-2 rounded-md border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-violet-500'
            placeholder='Enter new password'
          />
          {showPassword.new ? (
            <Eye
              strokeWidth={1.5}
              className='absolute right-3 top-8 cursor-pointer text-gray-400'
              onClick={() =>
                setShowPassword((prev) => ({
                  ...prev,
                  new: !prev.new,
                }))
              }
            />
          ) : (
            <EyeClosed
              strokeWidth={1.5}
              className='absolute right-3 top-8 cursor-pointer text-gray-400'
              onClick={() =>
                setShowPassword((prev) => ({
                  ...prev,
                  new: !prev.new,
                }))
              }
            />
          )}
        </div>

        <div className='relative'>
          <label className='block text-sm text-gray-600 mb-1'>
            Confirm New Password
          </label>
          <input
            type={showPassword.confirm ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className='w-full px-3 py-2 rounded-md border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-violet-500'
            placeholder='Confirm new password'
          />
          {showPassword.confirm ? (
            <Eye
              strokeWidth={1.5}
              className='absolute right-3 top-8 cursor-pointer text-gray-400'
              onClick={() =>
                setShowPassword((prev) => ({
                  ...prev,
                  confirm: !prev.confirm,
                }))
              }
            />
          ) : (
            <EyeClosed
              strokeWidth={1.5}
              className='absolute right-3 top-8 cursor-pointer text-gray-400'
              onClick={() =>
                setShowPassword((prev) => ({
                  ...prev,
                  confirm: !prev.confirm,
                }))
              }
            />
          )}
        </div>
      </div>

      {/* Action Button */}
      <button
        disabled={loading}
        onClick={handleChangePassword}
        className='mt-6 w-full px-4 py-2 bg-violet-600 text-white font-medium rounded-md hover:bg-violet-700 transition'
      >
        {loading ? 'Updating...' : 'Change Password'}
      </button>
    </div>
  );
}
