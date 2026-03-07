import { Link, useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { useEffect, useState } from 'react';
import useFetch from '../hooks/useFetch';
import { Eye, EyeOff } from 'lucide-react';

export default function ResetPassword() {
  const navigate = useNavigate();
  const { token } = useParams();
  const [requestGranted, setRequestGranted] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState({
    new: false,
    confirm: false,
  });
  const { fetchData, loading, error } = useFetch();

  useEffect(() => {
    const verifyRequest = async () => {
      const req = await fetchData(`/user/recovery/verify-request/${token}`, {
        method: 'GET',
      });

      if (req.status === 'OK') {
        setRequestGranted(true);
      }
    };

    verifyRequest();
  }, [requestGranted]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = await fetchData('user/recovery/reset-password', {
      method: 'PATCH',
      data: { password: confirm, token },
    });

    if (data.message === 'Success') {
      navigate('/sign-in', { replace: true });
    }
  };

  if (
    !requestGranted ||
    error === "You're not authorized for this action." ||
    error === 'Token has been expired already.'
  ) {
    return (
      <div className='flex flex-col min-h-screen items-center justify-center'>
        <p className='text-gray-700'>{error}</p>
        <Link
          to='/sign-in'
          replace={true}
          className='flex mt-5 text-sm justify-center items-center gap-3 hover:text-gray-400 bg-gray-300 hover:bg-gray-100 text-white p-4 rounded-lg w-[350px]'
        >
          <ChevronLeft strokeWidth={1.5} className='size-6' />
          <span>Back to Sign In</span>
        </Link>
      </div>
    );
  }

  return (
    <div className='flex min-h-screen w-full text-gray-900 items-center justify-center'>
      <div className='flex flex-col gap-5'>
        <header className='flex mb-5 flex-col items-center'>
          <h1 className='text-3xl font-bold'>Reset Your Password</h1>
          <p className='text-sm'>secure your account with a strong password</p>
        </header>

        <form action='' className='flex flex-col'>
          <div className='relative'>
            <input
              type={showPassword.new ? 'text' : 'password'}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className='p-4 rounded-lg ring ring-gray-400 hover:ring-2 hover:ring-violet-500 focus:ring-2 focus:ring-violet-500 outline-none w-full'
              placeholder='Enter new password'
            />
            {showPassword.new ? (
              <EyeOff
                onClick={() =>
                  setShowPassword((prev) => ({ ...prev, new: !prev.new }))
                }
                className='absolute cursor-pointer right-3 top-1/2 -translate-y-1/2 text-gray-400'
              />
            ) : (
              <Eye
                onClick={() =>
                  setShowPassword((prev) => ({ ...prev, new: !prev.new }))
                }
                className='absolute cursor-pointer right-3 top-1/2 -translate-y-1/2 text-gray-400'
              />
            )}
          </div>
          <div className='my-5 relative'>
            <input
              type={showPassword.confirm ? 'text' : 'password'}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className='p-4 rounded-lg ring ring-gray-400 hover:ring-2 hover:ring-violet-500 focus:ring-2 focus:ring-violet-500 outline-none w-full'
              placeholder='Confirm new password'
            />
            {showPassword.confirm ? (
              <EyeOff
                onClick={() =>
                  setShowPassword((prev) => ({
                    ...prev,
                    confirm: !prev.confirm,
                  }))
                }
                className='absolute cursor-pointer right-3 top-1/2 -translate-y-1/2 text-gray-400'
              />
            ) : (
              <Eye
                onClick={() =>
                  setShowPassword((prev) => ({
                    ...prev,
                    confirm: !prev.confirm,
                  }))
                }
                className='absolute cursor-pointer right-3 top-1/2 -translate-y-1/2 text-gray-400'
              />
            )}
          </div>
          <div className='flex gap-3'>
            <Link
              to='/sign-in'
              className='flex hover:text-gray-400 rounded-full text-center items-center gap-3 bg-gray-300 hover:bg-gray-100 text-white p-4'
            >
              <ChevronLeft strokeWidth={1.5} className='size-6' />
            </Link>
            <input
              onClick={handleSubmit}
              disabled={loading}
              type='submit'
              value={loading ? 'Processing...' : 'Reset Password'}
              className={`${loading ? 'bg-violet-200 hover:bg-violet-100 text-violet-500 cursor-not-allowed' : 'bg-violet-500 hover:bg-violet-400 text-white cursor-pointer '} flex-1 p-4 rounded-lg w-full`}
            />
          </div>
        </form>
      </div>
    </div>
  );
}
