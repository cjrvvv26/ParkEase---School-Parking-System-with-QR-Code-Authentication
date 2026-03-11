import React, { useState } from 'react';
import DefaultInput from '../components/forms/DefaultInput';
import useFetch from '../hooks/useFetch';
import { useNavigate } from 'react-router-dom';

export default function AddCourse() {
  const navigate = useNavigate();
  const [course, setCourse] = useState('');
  const [description, setDescription] = useState('');
  const { fetchData, loading, setError, error } = useFetch();

  const handleSubmit = async () => {
    const res = await fetchData('/course/add-course', {
      method: 'POST',
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
      <header className='flex justify-between px-5 pt-5 items-center'>
        <div className='flex flex-col'>
          <h1 className='font-bold text-3xl'>Add Course</h1>
          <p className='text-gray-400'>Add new course in the system.</p>
        </div>
      </header>
      <form className='flex gap-5 flex-col self-start w-80 px-5'>
        <DefaultInput
          label={'Name'}
          placeholder={'BSIT'}
          onChange={setCourse}
        />
        <DefaultInput
          label={'Description'}
          onChange={setDescription}
          placeholder={'Bachelor of Science in Information Technology'}
        />
        <input
          onSubmit={handleSubmit}
          type='submit'
          value='Add'
          className='self-start py-2 px-8 rounded-md hover:opacity-80 text-white bg-violet-500 cursor-pointer'
        />
      </form>
    </>
  );
}
