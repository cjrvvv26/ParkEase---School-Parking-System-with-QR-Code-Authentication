import { useSelector } from 'react-redux';

export default function useDark() {
  const { theme } = useSelector((s) => s.auth);
  const dark = theme === 'dark';
  return {
    dark,
    bg: dark ? 'bg-[#242424]' : 'bg-white',
    canvasBg: dark ? '#2f2f2f' : '#f9fafb',
    canvasOuterBg: dark ? '#1a1a1a' : '#f3f4f6',
    canvasGridStroke: dark ? '#3a3a3a' : '#e5e7eb',
    shapeColor: dark ? '#3a3a3a' : '#d1d5dc',
    card: dark ? 'bg-[#2f2f2f]' : 'bg-gray-100',
    cardInner: dark ? 'bg-[#3a3a3a]' : 'bg-white',
    border: dark ? 'border-[#3a3a3a]' : 'border-gray-200',
    text: dark ? 'text-gray-200' : 'text-gray-700',
    subText: dark ? 'text-gray-400' : 'text-gray-400',
    hover: dark ? 'hover:bg-[#3a3a3a]' : 'hover:bg-gray-50',
    input: dark ? 'bg-[#3a3a3a] border-[#4a4a4a] text-gray-200 placeholder-gray-500' : 'bg-gray-50 border-gray-200 text-gray-800',
  };
}
