import React, { useState } from 'react';
import DefaultInput from '../components/forms/DefaultInput';
import useFetch from '../hooks/useFetch';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import useDark from '../hooks/useDark';

export default function AddCourse() {
  const navigate = useNavigate();
  const [course, setCourse] = useState('');
  const [description, setDescription] = useState('');
  const { fetchData, loading, setError, error } = useFetch();
  const { dark } = useDark();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!course.trim() || !description.trim()) {
      return setError('All fields must be filled.');
    }
    const res = await fetchData('/course/add', {
      method: 'POST',
      data: { name: course, description },
    });

    if (res.message === 'Success')
      return navigate('/courses', {
        state: 'Successfully added a new course',
        replace: true,
      });

    setError(res.error);
  };

  return (
    <>
      <header className='flex flex-col justify-between px-5 pt-5'>
        <Link
          to={'/courses'}
          className='flex gap-1 text-gray-400 items-center justify-center text-xs hover:text-blue-500 self-start cursor-pointer'
        >
          <ChevronLeft strokeWidth={1.5} size={15} />
          <span>View courses</span>
        </Link>

        <div className='flex flex-col'>
          <h1 className={`font-bold text-3xl ${dark ? 'text-gray-100' : ''}`}>Add Course</h1>
          <p className='text-gray-400'>Add new course in the system.</p>
        </div>
      </header>
      <form
        onSubmit={handleSubmit}
        className='flex gap-3 flex-col self-start w-80 px-5'
      >
        <DefaultInput
          label={'Name'}
          placeholder={'BSIT'}
          value={course.toUpperCase()}
          onChange={(e) => setCourse(e.target.value.replace(/[^a-zA-Z\s]/g, ''))}
        />
        <DefaultInput
          label={'Description'}
          value={description}
          onChange={(e) => setDescription(e.target.value.replace(/[^a-zA-Z\s]/g, ''))}
          placeholder={'Bachelor of Science in Information Technology'}
        />
        {error && <p className='text-xs text-red-500'>{error}</p>}
        <input
          disabled={loading}
          type='submit'
          value={loading ? 'Processing...' : 'Add'}
          className='self-start py-2 px-8 rounded-md hover:opacity-80 text-white bg-blue-500 cursor-pointer'
        />
      </form>
    </>
  );
}
