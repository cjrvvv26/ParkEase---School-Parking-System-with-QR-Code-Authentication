import React from 'react';
import useDark from '../../hooks/useDark';

export default function OccupancyRateSingle({
  occupiedSlots,
  totalSlots,
  loading = false,
}) {
  const { dark, cardInner } = useDark();

  if (loading) {
    return (
      <div
        className={`h-12 rounded-xl animate-pulse ${dark ? 'bg-[#3a3a3a]' : 'bg-gray-200'}`}
      ></div>
    );
  }

  const total = totalSlots || 100;
  const occupied = occupiedSlots || 0;
  const pct = Math.round((occupied / total) * 100);

  return (
    <div className={`rounded-xl overflow-hidden h-12 ${cardInner}`}>
      <div
        className='h-full bg-gradient-to-r from-red-400 via-orange-400 to-green-400 rounded-xl transition-all duration-1000 relative overflow-hidden'
        style={{ width: `${pct}%` }}
      >
        <div className='absolute inset-0 bg-gradient-to-r from-red-500/30 via-orange-500/30 to-green-500/30 animate-pulse'></div>
      </div>
      <div className='absolute inset-0 flex items-center justify-between px-4 text-sm font-semibold'>
        <span className='text-gray-700'>{occupied}</span>
        <span className='text-gray-500'>/{total}</span>
        <span className='text-blue-600'>{pct}%</span>
      </div>
    </div>
  );
}
