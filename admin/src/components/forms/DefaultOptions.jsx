import { useState, useRef, useEffect } from 'react';
import useDark from '../../hooks/useDark';

export default function DefaultOptions({ label, value, onChange, placeholder, options = [] }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const { dark } = useDark();

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (option) => {
    if (typeof onChange === 'function') {
      try { onChange({ target: { value: option } }); } catch { onChange(option); }
    }
    setOpen(false);
  };

  const btnCls = `mt-2 px-3 py-2 relative ring rounded-md text-sm hover:ring-violet-500 focus:ring-violet-500 hover:ring-2 focus:ring-2 flex items-center justify-between ${dark ? 'bg-[#3a3a3a] ring-[#4a4a4a] text-gray-200' : 'bg-white ring-gray-200'}`;
  const dropdownCls = `absolute left-0 right-0 z-20 top-[68px] rounded-md shadow-sm overflow-hidden ring ${dark ? 'bg-[#2f2f2f] ring-[#4a4a4a]' : 'bg-white ring-gray-200'}`;

  return (
    <label ref={ref} className='relative flex flex-col text-sm'>
      <span className={dark ? 'text-gray-400' : 'text-gray-700'}>{label}</span>
      <button type='button' onClick={() => setOpen((v) => !v)} className={btnCls}>
        <span className={`${value ? (dark ? 'text-gray-200' : 'text-gray-700') : 'text-gray-400'} truncate text-left`}>
          {value || placeholder}
        </span>
        <svg className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : 'rotate-0'}`} xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={1.5} stroke='currentColor'>
          <path strokeLinecap='round' strokeLinejoin='round' d='m19.5 8.25-7.5 7.5-7.5-7.5' />
        </svg>
      </button>
      {open && (
        <div className={dropdownCls}>
          <ul className='max-h-56 overflow-auto'>
            {options.length > 0 ? options.map((option, idx) => (
              <li key={idx}>
                <button type='button' onMouseDown={() => handleSelect(option)}
                  className={`w-full text-left px-3 py-2 text-sm hover:bg-violet-500 hover:text-white ${dark ? 'text-gray-200' : 'text-gray-700'}`}>
                  {option}
                </button>
              </li>
            )) : (
              <div className='px-3 py-2 text-sm text-gray-400'>No options</div>
            )}
          </ul>
        </div>
      )}
    </label>
  );
}
