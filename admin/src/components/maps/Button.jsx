import useDark from '../../hooks/useDark';

export default function Button({ name, onClick }) {
  const { dark } = useDark();
  return (
    <button
      onClick={onClick}
      className={`rounded-sm text-xs px-3 py-2 border transition ${dark ? 'bg-[#2f2f2f] border-[#4a4a4a] text-gray-300 hover:bg-[#3a3a3a]' : 'border-gray-200 text-gray-700 hover:text-gray-500'}`}
    >
      {name}
    </button>
  );
}
