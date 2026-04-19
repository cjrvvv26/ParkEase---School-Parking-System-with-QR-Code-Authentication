import React from 'react';
import useDark from '../../hooks/useDark';

export default function OccupancyRateProgress({
  chartData = null,
  loading = false,
}) {
  const { dark, cardInner } = useDark();

  const labels = chartData?.labels || [
    '5-8 AM',
    '9-11 AM',
    '12-2 PM',
    '3-5 PM',
    '6-8 PM',
  ];
  const rawValues = chartData?.values || [0, 0, 0, 0, 0];
  const total = rawValues.reduce((s, v) => s + v, 0);
  const maxValue = Math.max(...rawValues, 1);
  const values = rawValues.map((v) => Math.round((v / maxValue) * 100));

  if (loading) {
    return (
      <div className='space-y-2'>
        {Array.from({ length: 5 }, (_, i) => (
          <div key={i} className='flex items-center gap-4 animate-pulse'>
            <div
              className={`h-3 w-20 rounded ${dark ? 'bg-[#3a3a3a]' : 'bg-gray-200'}`}
            ></div>
            <div
              className={`h-6 flex-1 rounded-xl ${dark ? 'bg-[#3a3a3a]' : 'bg-gray-200'}`}
            ></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className='space-y-2'>
      {labels.map((label, i) => (
        <div key={i} className='flex items-center gap-4'>
          <span className='w-20 text-xs font-medium text-gray-500'>
            {label}
          </span>
          <div className={`rounded-xl h-6 flex-1 overflow-hidden ${cardInner}`}>
            <div
              className='h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-xl transition-all'
              style={{ width: `${values[i]}%` }}
            />
          </div>
          <span className='w-16 text-xs font-medium text-gray-600'>
            {rawValues[i]}
            {total > 0 ? ` (${Math.round((rawValues[i] / total) * 100)}%)` : ''}
          </span>
        </div>
      ))}
    </div>
  );
}
