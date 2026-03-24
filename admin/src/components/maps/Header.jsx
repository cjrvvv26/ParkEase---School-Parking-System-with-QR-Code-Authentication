import Button from './Button';
import { Eye } from 'lucide-react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export default function Header({ areaName, onNew, onUndo, onRedo, onZoomIn, onZoomOut, onPreview, onSave, onDelete, isUpdateMode, isSaving = false }) {
  const { user, theme } = useSelector((s) => s.auth);
  const dark = theme === 'dark';
  const navigate = useNavigate();

  return (
    <div className={`flex flex-col gap-3 text-xs p-2 border-b ${dark ? 'bg-[#242424] border-[#3a3a3a] text-gray-200' : 'bg-white border-gray-200 text-gray-700'}`}>
      <section className='flex relative justify-between'>
        <div className='flex gap-3 items-center'>
          <h1
            onClick={() => navigate('/parking')}
            className='text-base font-semibold cursor-pointer hover:text-violet-500 transition'
          >
            School Parking System - Map Editor
          </h1>
          <p className='py-1 px-2 rounded-sm border border-violet-500 text-violet-500'>BETA</p>
        </div>
        <p className='-translate-x-1/2 left-1/2 absolute font-semibold text-base'>{areaName || 'Admin Bldg'}</p>
        <div className='flex items-center gap-3'>
          <p>{user.name}</p>
          <img src={user.profileDetails?.url} alt='' className='h-8 w-8 object-cover rounded-full' />
        </div>
      </section>
      <section className='flex justify-between items-center'>
        <div className='flex items-center gap-3'>
          <Button name='New' onClick={onNew} />
          <Button name='Undo' onClick={onUndo} />
          <Button name='Redo' onClick={onRedo} />
          <Button name='Zoom In' onClick={onZoomIn} />
          <Button name='Zoom Out' onClick={onZoomOut} />
        </div>
        <div className='flex gap-3'>
          {isUpdateMode && (
            <button onClick={onDelete} className='rounded-md py-2 px-3 border border-rose-300 text-rose-500 hover:bg-rose-50 flex items-center gap-2 transition'>
              <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={1.5} stroke='currentColor' className='size-4'>
                <path strokeLinecap='round' strokeLinejoin='round' d='m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0' />
              </svg>
              Delete Map
            </button>
          )}
          <button onClick={onPreview} className={`rounded-md py-2 px-3 border flex gap-2 items-center transition ${dark ? 'border-[#3a3a3a] hover:bg-[#3a3a3a]' : 'border-gray-200 hover:text-gray-500'}`}>
            <Eye strokeWidth={1.5} className='size-4' />
            <span>Preview</span>
          </button>
          <button onClick={onSave} disabled={isSaving} className='rounded-md py-2 px-3 bg-violet-500 text-white disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2'>
            {isSaving ? (
              <>
                <svg className='animate-spin size-4' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'>
                  <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'></circle>
                  <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'></path>
                </svg>
                Saving...
              </>
            ) : 'Save'}
          </button>
        </div>
      </section>
    </div>
  );
}
