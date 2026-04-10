import * as Icons from 'lucide-react';
import useDark from '../../hooks/useDark';

export default function IconButton({ name, label, action, ...props }) {
  const { dark } = useDark();
  const Icon = Icons[name];
  if (!Icon) return null;

  return (
    <button onClick={action} className='hover:bg-blue-500 group p-2 rounded-md relative'>
      <Icon
        className={`size-5 group-hover:text-white ${dark ? 'text-gray-300' : 'text-gray-600'}`}
        strokeWidth={1.5}
        {...props}
      />
      <span className={`bottom-10 border p-2 rounded-md text-xs absolute -translate-x-1/2 left-1/2 opacity-0 scale-95 transition-all group-hover:opacity-100 group-hover:scale-100 delay-100 whitespace-nowrap ${dark ? 'bg-[#3a3a3a] border-[#4a4a4a] text-gray-300' : 'bg-white border-gray-200 text-gray-500'}`}>
        {label}
      </span>
    </button>
  );
}
