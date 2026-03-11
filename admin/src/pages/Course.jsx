import { CirclePlus, Trash, Trash2 } from 'lucide-react';
import React from 'react';
import { Link } from 'react-router-dom';

export default function Course() {
  return (
    <>
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
        <header className='grid px-2 grid-cols-3 border-b text-xs border-b-gray-200 py-2 font-semibold text-gray-500'>
          <p>COURSE NAME</p>
          <p>CREATED AT</p>
          <p>ACTION</p>
        </header>
        <ul className='flex flex-col mt-1 text-gray-700'>
          <li className='grid grid-cols-3 p-2 rounded-md hover:bg-gray-50'>
            <p>BSIT</p>
            <p>02/26/26</p>
            <Trash
              strokeWidth={1.5}
              className='hover:text-red-500 cursor-pointer'
            />
          </li>
        </ul>
      </section>
    </>
  );
}
