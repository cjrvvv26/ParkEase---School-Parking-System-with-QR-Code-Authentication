import useDark from '../../hooks/useDark';

export default function DefaultInput({ label, value, onChange, placeholder, onlyRead, type }) {
  const { dark } = useDark();

  const labelCls = dark ? 'text-gray-400' : onlyRead ? 'text-gray-500' : 'text-gray-700';
  const inputCls = onlyRead
    ? `mt-2 px-3 py-2 text-sm outline-none ${dark ? 'text-gray-300 bg-transparent' : 'text-gray-700'}`
    : `mt-2 px-3 py-2 text-sm outline-none rounded-md ring ring-gray-200 hover:ring-blue-500 focus:ring-blue-500 hover:ring-2 focus:ring-2 ${dark ? 'bg-[#3a3a3a] ring-[#4a4a4a] text-gray-200 placeholder-gray-500' : 'bg-white text-gray-700 placeholder-gray-400'}`;

  return (
    <label className='flex flex-col text-sm'>
      <span className={labelCls}>{label}</span>
      <input
        value={value}
        readOnly={onlyRead}
        onChange={onChange}
        type={type || 'text'}
        placeholder={placeholder}
        className={inputCls}
      />
    </label>
  );
}
