import React, { useState, useEffect } from 'react';
import ReportSummaryCard from '../components/charts/ReportSummaryCard';
import RevenueChart from '../components/charts/RevenueChart';
import AvgParkingDurationChart from '../components/charts/AvgParkingDurationChart';
import MotorOccupancyChart from '../components/charts/MotorOccupancyChart';
import useFetch from '../hooks/useFetch';
import { Printer } from 'lucide-react';
import useDark from '../hooks/useDark';

export default function Analytics() {
  const [showYearLevelList, toggleYearLevelList] = useState(false);
  const [loadingStats, setLoadingStats] = useState(true);
  const [stats, setStats] = useState(null);
  const { fetchData } = useFetch();
  const [selectedYearLevel, setYearLevel] = useState('All');
  const yearLevels = ['All', '1st Year', '2nd Year', '3rd Year', '4th Year'];
  const { dark, card, cardInner, border } = useDark();

  useEffect(() => {
    const fetchSystemSummary = async () => {
      try {
        setLoadingStats(true);
        const response = await fetchData('/report/system-summary');
        if (response?.data) setStats(response.data);
      } catch (err) {
        console.error('Failed to fetch system summary:', err);
      } finally {
        setLoadingStats(false);
      }
    };
    fetchSystemSummary();
  }, []);

  const handleGeneratePDF = () => window.open('http://localhost:5000/report/generate', '_blank');

  return (
    <>
      <header className='flex justify-between px-5 pt-5 items-center'>
        <div className='flex flex-col'>
          <h1 className='font-bold text-3xl'>Reports & Analytics</h1>
          <p className='text-gray-400'>View and analyze system data through detailed reports and visual summaries.</p>
        </div>
        <div className='flex gap-5'>
          <button onClick={handleGeneratePDF} className='flex gap-2 px-4 py-2 rounded-md bg-green-100 text-green-500 ring ring-green-500'>
            <Printer strokeWidth={1.5} size={20} />
            <span>Generate PDF</span>
          </button>
        </div>
      </header>

      <div className='flex gap-5 h-[150px] px-5'>
        <ReportSummaryCard stats={stats} loading={loadingStats} />
      </div>

      {/* Revenue */}
      <div className={`rounded-xl h-auto mx-5 ${card}`}>
        <div className='flex flex-col gap-5 h-full p-5'>
          <h1 className='text-base font-medium'>Revenue Per School Year</h1>
          <div className='flex-1 flex flex-col h-[400px] gap-5'>
            <RevenueChart />
          </div>
          <div className='flex gap-5 h-full rounded-xl'>
            <div className={`flex flex-col justify-center gap-1 h-full ${cardInner} rounded-xl p-5 flex-1 relative`}>
              <h2 className='text-sm text-gray-400'>Last Semester</h2>
              <p className='font-semibold text-2xl'>&#8369; 1,200.00</p>
              <div className='flex gap-1 items-center text-xs text-rose-500 p-2 absolute top-5 right-5 rounded-lg bg-rose-100 border border-rose-500'>
                <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={1.5} stroke='currentColor' className='size-4'>
                  <path strokeLinecap='round' strokeLinejoin='round' d='M2.25 6 9 12.75l4.286-4.286a11.948 11.948 0 0 1 4.306 6.43l.776 2.898m0 0 3.182-5.511m-3.182 5.51-5.511-3.181' />
                </svg>
                <p>+10%</p>
              </div>
            </div>
            <div className={`flex flex-col justify-center gap-1 h-full ${cardInner} rounded-xl p-5 flex-1 relative`}>
              <h2 className='text-sm text-gray-400'>Current Semester</h2>
              <p className='font-semibold text-2xl'>&#8369; 1,500.00</p>
              <div className='flex gap-1 items-center text-xs text-green-500 p-2 absolute top-5 right-5 rounded-lg bg-green-100 border border-green-500'>
                <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={1.5} stroke='currentColor' className='size-4'>
                  <path strokeLinecap='round' strokeLinejoin='round' d='M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941' />
                </svg>
                <p>+10%</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className='flex gap-5 mx-5'>
        <div className={`rounded-xl flex-3 h-auto ${card}`}>
          <div className='flex flex-col gap-2 p-5 h-full'>
            <h1 className='text-base font-medium'>Average Parking Duration</h1>
            <div className='h-[500px]'><AvgParkingDurationChart /></div>
          </div>
        </div>
        <div className='flex gap-5 flex-col'>
          <div className={`flex-1 self-start w-full rounded-xl ${card}`}>
            <div className='p-5 h-full flex flex-col'>
              <h1 className='text-base font-medium'>Today's Motor Occupancy</h1>
              <div className='flex-1'><MotorOccupancyChart /></div>
              <p className='text-gray-400 text-xs'>There are 24 motors parked today</p>
            </div>
          </div>
          <div className={`${card} rounded-xl p-5 flex flex-col gap-4`}>
            <h1 className='font-medium text-base'>Preferred Parking Area</h1>
            {[1, 2, 3].map((num) => (
              <div key={num} className={`relative p-4 ${cardInner} rounded-xl pl-12`}>
                <span className='absolute left-0 top-0 bottom-0 w-10 flex items-center justify-center bg-violet-500 text-white font-semibold rounded-l-xl'>{num}</span>
                <p className={dark ? 'text-gray-300' : 'text-gray-700'}>Admin Building Parking Area</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className='flex gap-5 h-[500px] mx-5 mb-5'>
        <div className={`${card} rounded-xl p-5 flex flex-col flex-1 gap-5`}>
          <header className='flex items-center justify-between'>
            <h1 className='text-base font-medium'>Number of Users per Course</h1>
            <button
              onClick={() => toggleYearLevelList(!showYearLevelList)}
              className={`flex relative w-auto items-center gap-2 pr-2 pl-4 py-2 rounded-xl ring cursor-pointer ${dark ? 'ring-[#3a3a3a] text-gray-200 bg-[#3a3a3a]' : 'ring-gray-200 text-gray-700 bg-white'}`}
            >
              <p>{selectedYearLevel}</p>
              <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={1.5} stroke='currentColor' className={`${showYearLevelList ? 'rotate-180' : 'rotate-0'} size-4 duration-100`}>
                <path strokeLinecap='round' strokeLinejoin='round' d='m19.5 8.25-7.5 7.5-7.5-7.5' />
              </svg>
              {showYearLevelList && (
                <div className={`flex flex-col p-2 top-10 rounded-xl w-28 right-0 absolute ring z-20 ${dark ? 'bg-[#3a3a3a] ring-[#4a4a4a]' : 'bg-white ring-gray-200'}`}>
                  {yearLevels.map((level, index) => (
                    <button key={index} onClick={() => setYearLevel(level)} className='p-2 rounded-lg hover:bg-violet-500 hover:text-white text-nowrap'>
                      {level}
                    </button>
                  ))}
                </div>
              )}
            </button>
          </header>
          <div className='flex-1 overflow-y-scroll [scrollbar-width:none] flex flex-col gap-3'>
            {Array.from({ length: 5 }, (_, i) => (
              <div key={i} className='py-2 flex items-center gap-5'>
                <p className={dark ? 'text-gray-300' : 'text-gray-700'}>BSIT</p>
                <div className={`rounded-xl overflow-hidden relative ${cardInner} w-full py-2 h-[24px]`}>
                  <span className='w-[80%] h-full top-0 left-0 rounded-s-xl absolute bg-violet-500'></span>
                </div>
                <p className='w-[100px] text-right'>35 Users</p>
              </div>
            ))}
          </div>
          <div className={`rounded-xl p-5 ${cardInner} flex flex-col h-auto justify-between`}>
            <div className='flex items-start justify-between'>
              <div>
                <h4 className={`text-sm font-semibold ${dark ? 'text-gray-200' : 'text-gray-900'}`}>Top Course Summary</h4>
                <p className={`mt-2 text-2xl font-bold ${dark ? 'text-gray-100' : 'text-gray-900'}`}>
                  BSIT <span className={`text-base font-medium ${dark ? 'text-gray-300' : 'text-gray-700'}`}>· 35 users</span>
                </p>
                <p className='mt-1 text-xs text-gray-400'>
                  Represents <span className={`font-semibold ${dark ? 'text-gray-300' : 'text-gray-700'}`}>24%</span> of active users
                </p>
              </div>
              <div className='flex flex-col items-end gap-2'>
                <span className='text-xs text-green-500 bg-green-50 px-2 ring-green-500 ring py-1 rounded-full'>+8%</span>
                <div className='text-xs text-gray-400'>Compared to last month</div>
              </div>
            </div>
            <div className='mt-4'>
              <svg viewBox='0 0 120 28' className='w-full h-6' aria-hidden>
                <polyline fill='none' stroke='#7c3aed' strokeWidth='2' points='0,20 20,14 40,10 60,12 80,8 100,6 120,4' />
              </svg>
              <div className='mt-2 text-xs text-gray-400'>User trend over last 7 days</div>
            </div>
          </div>
        </div>

        <div className='flex flex-col gap-5 flex-1'>
          <div className={`${card} flex flex-col gap-5 relative p-5 rounded-xl flex-1`}>
            <header className='flex flex-col'>
              <h1 className='text-base font-medium'>Peak User Entry Time</h1>
              <p className='text-xs text-gray-400'>Most users enter at this time</p>
            </header>
            <div className='text-right flex flex-col absolute top-5 right-5'>
              <h1 className={`font-medium text-xl ${dark ? 'text-gray-100' : 'text-gray-900'}`}>8:15 AM</h1>
              <p className='text-xs text-gray-400'>18% of daily entries</p>
            </div>
            <div className='flex gap-5 items-center flex-1'>
              <p className={dark ? 'text-gray-300' : ''}>Admin Building Area</p>
              <div className='flex-1 h-full flex items-center justify-center'><MotorOccupancyChart /></div>
            </div>
          </div>
          <div className={`${card} rounded-xl overflow-hidden p-5 flex flex-col gap-5`}>
            <header className='flex justify-between items-center'>
              <h1 className='text-base font-medium'>Users Parking Duration</h1>
              <p className='text-xs text-gray-400'>Minutes per user (top)</p>
            </header>
            <div className='flex flex-col gap-2 w-full overflow-y-scroll [scrollbar-width:none]'>
              {Array.from({ length: 5 }, (_, index) => (
                <div className='flex items-center' key={index}>
                  <p className={`w-[180px] ${dark ? 'text-gray-300' : ''}`}>C. Valle</p>
                  <div className={`rounded-xl overflow-hidden relative ${cardInner} w-full py-2 h-[18px]`}>
                    <span className='w-[80%] h-full top-0 left-0 rounded-s-xl absolute bg-green-500'></span>
                  </div>
                  <p className='w-[100px] text-right'>110m</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
