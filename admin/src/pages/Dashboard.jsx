import { Link } from 'react-router-dom';
import ReportSummaryCard from '../components/charts/ReportSummaryCard';
import RevenueChart from '../components/charts/RevenueChart';
import AvgParkingDurationChart from '../components/charts/AvgParkingDurationChart';
import MotorOccupancyChart from '../components/charts/MotorOccupancyChart';
import { useState, useEffect } from 'react';
import useFetch from '../hooks/useFetch';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [availableSlots, setAvailableSlots] = useState(0);
  const [loadingStats, setLoadingStats] = useState(true);
  const [semesterRevenue, setSemesterRevenue] = useState(null);
  const [loadingRevenue, setLoadingRevenue] = useState(true);
  const [monthlyRevenue, setMonthlyRevenue] = useState(null);
  const [loadingMonthly, setLoadingMonthly] = useState(true);
  const { fetchData } = useFetch();

  useEffect(() => {
    const fetchSystemSummary = async () => {
      try {
        setLoadingStats(true);
        const response = await fetchData('/report/system-summary');
        if (response?.data) {
          setStats(response.data);
          setAvailableSlots(response.availableSlots || 0);
        }
      } catch (err) {
        console.error('Failed to fetch system summary:', err);
      } finally {
        setLoadingStats(false);
      }
    };

    const fetchSemesterRevenue = async () => {
      try {
        setLoadingRevenue(true);
        const response = await fetchData('/semester/revenue/dashboard');
        if (response?.data) {
          setSemesterRevenue(response.data);
        }
      } catch (err) {
        console.error('Failed to fetch semester revenue:', err);
      } finally {
        setLoadingRevenue(false);
      }
    };

    const fetchMonthlyRevenue = async () => {
      try {
        setLoadingMonthly(true);
        const response = await fetchData('/report/monthly-revenue');
        if (response?.data) {
          setMonthlyRevenue(response.data);
        }
      } catch (err) {
        console.error('Failed to fetch monthly revenue:', err);
      } finally {
        setLoadingMonthly(false);
      }
    };

    fetchSystemSummary();
    fetchSemesterRevenue();
    fetchMonthlyRevenue();
  }, []);
  return (
    <>
      {/* Header Page */}
      <header className='flex justify-between px-5 pt-5 items-center'>
        <div className='flex flex-col'>
          <h1 className='font-bold text-3xl'>Dashboard</h1>
          <p className='text-gray-400'>
            Here's the data summarization of the system
          </p>
        </div>
      </header>
      {/* Report Summary */}
      <div className='flex gap-5 h-[150px] px-5'>
        <ReportSummaryCard stats={stats} loading={loadingStats} />
      </div>
      {/* Mid Section */}
      <div className='flex gap-5 px-5'>
        {/* Revenue per Semester */}
        <div className='rounded-xl flex-3 h-auto bg-gray-100 '>
          <div className='flex flex-col gap-5 h-full p-5'>
            <h1 className='text-base font-medium'>Revenue Per Month</h1>
            {/* Data */}
            <div className=' w-full h-full gap-5'>
              <RevenueChart
                monthlyData={monthlyRevenue}
                loading={loadingMonthly}
              />
            </div>
            {/* Last and Current Sem Comparison */}
            <div className='flex gap-5 h-full rounded-xl'>
              {/* Last Semester */}
              <div className='flex flex-col justify-center gap-1 h-full bg-white rounded-xl p-5 flex-1 relative'>
                <h2 className='text-sm text-gray-400'>
                  {loadingRevenue
                    ? 'Loading...'
                    : semesterRevenue?.lastSemester?.name || 'Last Semester'}
                </h2>
                <p className='font-semibold text-2xl'>
                  &#8369;{' '}
                  {loadingRevenue
                    ? '...'
                    : (
                        semesterRevenue?.lastSemester?.revenue || 0
                      ).toLocaleString()}
                </p>
                {semesterRevenue?.percentageChange !== undefined &&
                  semesterRevenue?.percentageChange !== null && (
                    <div
                      className={`flex gap-1 items-center text-xs p-2 absolute top-5 right-5 rounded-lg border ${
                        semesterRevenue.percentageChange >= 0
                          ? 'text-green-500 bg-green-100 border-green-500'
                          : 'text-rose-500 bg-rose-100 border-rose-500'
                      }`}
                    >
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        fill='none'
                        viewBox='0 0 24 24'
                        strokeWidth={1.5}
                        stroke='currentColor'
                        className='size-4'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          d={
                            semesterRevenue.percentageChange >= 0
                              ? 'M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941'
                              : 'M2.25 6 9 12.75l4.286-4.286a11.948 11.948 0 0 1 4.306 6.43l.776 2.898m0 0 3.182-5.511m-3.182 5.51-5.511-3.181'
                          }
                        />
                      </svg>
                      <p>{Math.abs(semesterRevenue.percentageChange)}%</p>
                    </div>
                  )}
              </div>
              <div className='flex flex-col justify-center gap-1 h-full bg-white rounded-xl p-5 flex-1 relative'>
                <h2 className='text-sm text-gray-400'>
                  {loadingRevenue
                    ? 'Loading...'
                    : semesterRevenue?.currentSemester?.name ||
                      'Current Semester'}
                </h2>
                <p className='font-semibold text-2xl'>
                  &#8369;{' '}
                  {loadingRevenue
                    ? '...'
                    : (
                        semesterRevenue?.currentSemester?.revenue || 0
                      ).toLocaleString()}
                </p>
                {semesterRevenue?.percentageChange !== undefined &&
                  semesterRevenue?.percentageChange !== null && (
                    <div
                      className={`flex gap-1 items-center text-xs p-2 absolute top-5 right-5 rounded-lg border ${
                        semesterRevenue.percentageChange >= 0
                          ? 'text-green-500 bg-green-100 border-green-500'
                          : 'text-rose-500 bg-rose-100 border-rose-500'
                      }`}
                    >
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        fill='none'
                        viewBox='0 0 24 24'
                        strokeWidth={1.5}
                        stroke='currentColor'
                        className='size-4'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          d={
                            semesterRevenue.percentageChange >= 0
                              ? 'M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941'
                              : 'M2.25 6 9 12.75l4.286-4.286a11.948 11.948 0 0 1 4.306 6.43l.776 2.898m0 0 3.182-5.511m-3.182 5.51-5.511-3.181'
                          }
                        />
                      </svg>
                      <p>{Math.abs(semesterRevenue.percentageChange)}%</p>
                    </div>
                  )}
              </div>
            </div>
          </div>
        </div>
        {/* Mid right section */}
        <div className='flex-1 h-full gap-5 flex'>
          <div className='flex flex-1 flex-col gap-5'>
            {/* Slots Reminder (if already full, show system ratings) */}
            <div className='flex-1 w-full self-start rounded-xl bg-gradient-to-tl to-violet-500 via-violet-900 from-[#2d2d2d]'>
              {/* Slots Reminder */}
              <div className='p-5 h-full flex flex-col text-white justify-between'>
                <h1 className='font-medium text-base'>Parking Slots</h1>
                <h2 className='text-center mt-5'>
                  <span className='text-6xl font-medium'>{availableSlots}</span>{' '}
                  <br /> slots available
                </h2>
                <Link
                  to={'/parking'}
                  className='bg-white rounded-xl text-center py-4 font-medium mt-5 text-gray-700'
                >
                  View Map
                </Link>
              </div>
            </div>
            {/* Today's Motor Occupancy Chart */}
            <div className='flex-1 self-start w-full rounded-xl bg-gray-100'>
              <div className='p-5 h-full flex flex-col'>
                <h1 className='text-base font-medium'>
                  Today's Motor Occupancy
                </h1>
                <div className='h-full w-full'>
                  <MotorOccupancyChart />
                </div>
                <p className='text-gray-400 text-xs'>
                  There are 24 motors parked today
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Mid Section */}
      <div className='flex gap-5 px-5'>
        {/* Average Parking Duration */}
        <div className='rounded-xl flex-3 h-auto bg-gray-100 '>
          <div className='flex flex-col gap-2 p-5 h-full'>
            <h1 className='text-base font-medium'>Average Parking Duration</h1>
            {/* Data */}
            <div className='h-full w-full'>
              <AvgParkingDurationChart />
            </div>
          </div>
        </div>
        {/* Lists of Security guard */}
        <div className='flex flex-col rounded-xl bg-gray-100 h-full flex-1'>
          <div className='mt-5 mb-3 mx-5 flex items-center justify-between'>
            <h1 className='text-base font-medium'>Security Guard</h1>
            <button className='py-2 px-4 rounded-full bg-transparent ring ring-violet-500 text-violet-500 flex items-center gap-2'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth={1.5}
                stroke='currentColor'
                className='size-4'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M12 4.5v15m7.5-7.5h-15'
                />
              </svg>
              <p>New</p>
            </button>
          </div>
          <div className='flex-1 flex flex-col'>
            {/* GuardCard */}
            {Array.from({ length: 5 }, () => (
              <div className='flex gap-3 p-2 mx-3 hover:bg-gray-200 cursor-pointer items-center rounded-xl'>
                <img
                  src='https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&fm=jpg&q=60&w=3000'
                  alt=''
                  className='h-12 w-12 object-cover rounded-full'
                />
                <div className='flex flex-col'>
                  <h2 className='text-gray-700 font-medium'>Jacob Henderson</h2>
                  <p className='text-green-500 text-xs'>On duty</p>
                </div>
              </div>
            ))}
            <button className='bg-violet-500 mt-3 mb-5 rounded-xl py-4 text-white mx-5 font-medium'>
              View More
            </button>
          </div>
        </div>
      </div>
      {/* Bottom Section */}
      <section className='flex gap-5 px-5 pb-5'>
        <div className='flex-1 rounded-xl bg-gray-100 h-48'></div>
        <div className='flex-1 rounded-xl bg-gray-100 h-48'></div>
      </section>
    </>
  );
}
