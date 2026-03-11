import { CirclePlus, Trash, Trash2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import useFetch from '../hooks/useFetch';
import Modal from '../components/Modal';

export default function Course() {
  const location = useLocation();
  const [message, setMessage] = useState();
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [courses, setCourses] = useState([]);
  const { loading, error, setError, fetchData } = useFetch();

  useEffect(() => {
    if (location?.state) {
      setMessage(location.state);
    }
    const timer = setTimeout(() => {
      setMessage(null);
    }, 3000);

    return () => clearTimeout(timer);
  }, [location.state]);

  useEffect(() => {
    const getAllCourse = async () => {
      const data = await fetchData('/course', {
        method: 'GET',
      });

      if (data.courses.length > 0) {
        return setCourses(data.courses);
      }

      setError(data.error);
    };

    getAllCourse();
  }, []);

  const handleCourseDeletion = async (id) => {
    const res = await fetchData(`/course/${id}`, { method: 'DELETE' });

    if (res.message === 'Course deleted successfully') {
      setCourses((prev) => prev.filter((c) => c._id !== id));
      return setIsOpen(false);
    }

    setError(res.error);
  };

  return (
    <>
      {message && (
        <p className='absolute z-10 animate-pulse rounded-md p-4 bg-green-300 top-2 right-2 select-none text-white'>
          {message}
        </p>
      )}
      <header className='flex justify-between px-5 pt-5 items-center'>
        <div className='flex flex-col'>
          <h1 className='font-bold text-3xl'>Courses </h1>
          <p className='text-gray-400'>Manage student course or program.</p>
        </div>
        <Link
          to='/courses/add-course'
          className='py-2 bg-violet-500 rounded-md cursor-pointer hover:opacity-80 text-white px-4 flex gap-3 items-center'
        >
          <CirclePlus strokeWidth={1.5} />
          <span>Add Course</span>
        </Link>
      </header>
      <section className='flex px-5 flex-col'>
        <header className='grid px-2 grid-cols-4 gap-10 border-b text-xs border-b-gray-200 py-2 font-semibold text-gray-500'>
          <p>COURSE NAME</p>
          <p>DESCRIPTION</p>
          <p>CREATED AT</p>
          <p>ACTION</p>
        </header>
        <ul className='flex flex-col mt-1 text-gray-700'>
          {loading ? (
            <div className='flex flex-1 h-full mt-30 items-center justify-center'>
              <div className='border-2 mb-30 border-t-violet-500 border-violet-100 h-12 w-12 rounded-full animate-spin'></div>
            </div>
          ) : courses.length > 0 ? (
            courses.map((course, _) => (
              <li
                key={course._id}
                className='grid *:line-clamp-2 gap-10 grid-cols-4 p-2 rounded-md hover:bg-gray-50'
              >
                <p>{course.name}</p>
                <p>{course.description}</p>
                <p>{new Date(course.createdAt).toLocaleDateString()}</p>
                <Trash
                  onClick={() => {
                    setIsOpen(true);
                    setSelectedCourse(course._id);
                  }}
                  strokeWidth={1.5}
                  className='hover:text-red-500 cursor-pointer'
                />
              </li>
            ))
          ) : (
            <p className='text-gray-400 text-center mt-30'>No Courses</p>
          )}
        </ul>
        {isOpen && (
          <Modal onClose={() => setIsOpen(false)}>
            <div className='flex flex-col gap-4'>
              <h2 className='text-lg font-semibold'>Delete Course</h2>

              <p className='text-gray-500'>
                Are you sure you want to delete this course?
              </p>
              {error && <p className='-mt-3 text-red-500 text-xs'>{error}</p>}

              <div className='flex justify-end gap-3'>
                <button
                  onClick={() => setIsOpen(false)}
                  className='px-4 py-2 bg-gray-200 rounded'
                >
                  Cancel
                </button>

                <button
                  disabled={loading}
                  onClick={() => handleCourseDeletion(selectedCourse)}
                  className='px-4 py-2 bg-red-500 text-white rounded'
                >
                  {loading ? 'Processing...' : 'Delete'}
                </button>
              </div>
            </div>
          </Modal>
        )}
      </section>
    </>
  );
}
