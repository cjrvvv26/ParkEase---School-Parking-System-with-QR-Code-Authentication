import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { login } from '../features/authSlice';
import useFetch from '../hooks/useFetch';
import { UserCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import useDark from '../hooks/useDark';

const PencilIcon = () => (
  <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={1.5} stroke='currentColor' className='w-4 h-4 text-gray-400 group-hover:text-violet-600 transition'>
    <path strokeLinecap='round' strokeLinejoin='round' d='M16.862 3.487a2.1 2.1 0 0 1 2.97 2.97L8.25 18.04l-4.5 1.125 1.125-4.5L16.862 3.487z' />
  </svg>
);

export default function Profile() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const { loading, setError, error, fetchData } = useFetch();
  const [editingField, setEditingField] = useState(null);
  const [information, setInformation] = useState({ username: '', name: '', profileDetails: {} });
  const { dark, border, input } = useDark();

  useEffect(() => {
    if (user) setInformation({ username: user.username || '', name: user.name || '', profileDetails: user.profileDetails || {} });
  }, [user]);

  const handleChange = (e) => {
    setError(null);
    const { name, value } = e.target;
    if (name === 'username' && value.length > 35) return setError('Characters is too long.');
    setInformation((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (name, value) => {
    const updatedInfo = await fetchData('/super-admin/me', { method: 'PATCH', data: { [name]: value } });
    setEditingField(null);
    setInformation((prev) => ({ ...prev, ...updatedInfo }));
    dispatch(login(updatedInfo));
  };

  const handleChangePhoto = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('profileDetails', file);
    const updatedInfo = await fetchData('/super-admin/me', { method: 'PATCH', data: formData });
    setInformation((prev) => ({ ...prev, ...updatedInfo }));
    dispatch(login(updatedInfo));
  };

  if (!user) return <p className='p-5 text-gray-400 text-center'>Loading profile...</p>;

  const fieldClass = (field) =>
    `w-full px-3 py-2 pr-8 rounded-md border outline-none ${
      editingField === field ? 'border-violet-500 ' + (dark ? 'bg-[#3a3a3a] text-gray-200' : 'bg-white text-gray-800') : input
    }`;

  return (
    <>
      <header className='flex justify-between px-5 pt-5 items-center'>
        <div className='flex flex-col'>
          <h1 className={`font-bold text-3xl ${dark ? 'text-gray-100' : 'text-gray-800'}`}>Account Details</h1>
          <p className='text-sm text-gray-400'>Your organizational account details and activity status</p>
        </div>
      </header>

      <div className='mx-5 mt-5 pb-10'>
        <h2 className={`text-lg font-semibold mb-6 ${dark ? 'text-gray-200' : 'text-gray-700'}`}>Personal Information</h2>
        <div className='flex gap-8'>
          <div className='flex items-center flex-col gap-5'>
            <div className='relative'>
              {information?.profileDetails?.url ? (
                <img src={information.profileDetails.url} alt='Profile' className='w-50 h-50 rounded-full border-4 border-violet-500 object-cover' />
              ) : (
                <UserCircle className={`size-45 ${dark ? 'text-gray-500' : 'text-gray-600'}`} strokeWidth={1} />
              )}
              <span className='absolute bottom-2 right-2 w-4 h-4 bg-green-500 rounded-full border-2 border-white' />
            </div>
            <button className='flex items-center gap-2 px-5 py-2.5 rounded-xl bg-violet-500 text-white font-medium hover:bg-violet-400 active:scale-95 transition relative'>
              <input type='file' name='profileDetails' onChange={handleChangePhoto} className='absolute h-full w-full z-10 opacity-0 cursor-pointer' />
              <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={1.5} stroke='currentColor' className='w-5 h-5'>
                <path strokeLinecap='round' strokeLinejoin='round' d='M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3' />
              </svg>
              Change Photo
            </button>
          </div>

          <div className='flex-1 space-y-4'>
            {[
              { label: 'Username', name: 'username', value: information.username },
              { label: 'Name', name: 'name', value: information.name },
            ].map(({ label, name, value }) => (
              <div key={name} className='flex items-center gap-3 group'>
                <label className={`w-20 text-sm ${dark ? 'text-gray-400' : 'text-gray-500'}`}>{label}</label>
                <div className='relative flex-1 max-w-md'>
                  <input
                    type='text'
                    name={name}
                    value={value}
                    readOnly={editingField !== name}
                    autoFocus={editingField === name}
                    onChange={handleChange}
                    onKeyDown={(e) => { if (e.key === 'Enter') handleUpdate(name, e.target.value); }}
                    className={fieldClass(name)}
                  />
                  {editingField !== name && (
                    <span onClick={() => setEditingField(name)} className='absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer'><PencilIcon /></span>
                  )}
                </div>
              </div>
            ))}

            {[
              { label: 'Role', value: user?.role || '' },
              { label: 'Email', value: user?.email || '' },
            ].map(({ label, value }) => (
              <div key={label} className='flex items-center gap-3'>
                <label className={`w-20 text-sm ${dark ? 'text-gray-400' : 'text-gray-500'}`}>{label}</label>
                <div className='relative flex-1 max-w-md'>
                  <input type='text' value={value} readOnly className={`w-full px-3 py-2 rounded-md border outline-none ${input}`} />
                </div>
              </div>
            ))}

            {error && <p className='text-xs text-red-500'>{error}</p>}
            <div className={`mt-8 ${dark ? 'text-gray-400' : 'text-gray-400'}`}>
              <span>Change your password? </span>
              <Link to='/change-password' className='hover:text-violet-500 hover:underline'>Go here</Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
