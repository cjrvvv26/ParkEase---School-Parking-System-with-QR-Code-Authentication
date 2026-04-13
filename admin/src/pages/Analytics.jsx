import React, { useState, useEffect, useRef } from 'react';
import ReportSummaryCard from '../components/charts/ReportSummaryCard';
import RevenueChart from '../components/charts/RevenueChart';
import AvgParkingDurationChart from '../components/charts/AvgParkingDurationChart';
import MotorOccupancyChart from '../components/charts/MotorOccupancyChart';
import useFetch from '../hooks/useFetch';
import { Printer } from 'lucide-react';
import useDark from '../hooks/useDark';

export default function Analytics() {
  const { fetchData } = useFetch();
  const { dark, card, cardInner, border } = useDark();

  // Summary
  const [stats, setStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(true);

  // Revenue
  const [monthlyRevenue, setMonthlyRevenue] = useState(null);
  const [loadingMonthly, setLoadingMonthly] = useState(true);
  const [semesterRevenue, setSemesterRevenue] = useState(null);
  const [loadingRevenue, setLoadingRevenue] = useState(true);

  // Avg parking duration chart
  const [avgParkingData, setAvgParkingData] = useState(null);
  const [loadingAvgParking, setLoadingAvgParking] = useState(true);

  // Motor occupancy chart
  const [occupancyData, setOccupancyData] = useState(null);
  const [loadingOccupancy, setLoadingOccupancy] = useState(true);

  // Preferred areas
  const [preferredAreas, setPreferredAreas] = useState([]);
  const [loadingAreas, setLoadingAreas] = useState(true);

  // Users per course (dropdown = course, rows = year levels)
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showCourseList, setShowCourseList] = useState(false);
  const [courseRows, setCourseRows] = useState([]);
  const [courseTotal, setCourseTotal] = useState(0);
  const [loadingCourse, setLoadingCourse] = useState(false);

  // Top parking duration
  const [topDuration, setTopDuration] = useState([]);
  const [loadingDuration, setLoadingDuration] = useState(true);

  // Peak entry time
  const [peakData, setPeakData] = useState(null);
  const [loadingPeak, setLoadingPeak] = useState(true);
  const [clock, setClock] = useState(new Date());

  // Live clock
  useEffect(() => {
    const t = setInterval(() => setClock(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const run = async (fn) => {
      try {
        await fn();
      } catch (e) {}
    };

    run(async () => {
      setLoadingStats(true);
      const r = await fetchData('/report/system-summary');
      if (r?.data) setStats(r.data);
      setLoadingStats(false);
    });

    run(async () => {
      setLoadingMonthly(true);
      const r = await fetchData('/report/monthly-revenue');
      if (r?.data) setMonthlyRevenue(r.data);
      setLoadingMonthly(false);
    });

    run(async () => {
      setLoadingRevenue(true);
      const r = await fetchData('/semester/revenue/dashboard');
      if (r?.data) setSemesterRevenue(r.data);
      setLoadingRevenue(false);
    });

    run(async () => {
      setLoadingAvgParking(true);
      const r = await fetchData('/report/avg-parking-by-hour');
      if (r?.data) setAvgParkingData(r.data);
      setLoadingAvgParking(false);
    });

    run(async () => {
      setLoadingOccupancy(true);
      const r = await fetchData('/report/occupancy-by-hour');
      if (r?.data) setOccupancyData(r.data);
      setLoadingOccupancy(false);
    });

    run(async () => {
      setLoadingAreas(true);
      const r = await fetchData('/report/preferred-areas');
      if (r?.data) setPreferredAreas(r.data);
      setLoadingAreas(false);
    });

    run(async () => {
      setLoadingDuration(true);
      const r = await fetchData('/report/top-parking-duration');
      if (r?.data) setTopDuration(r.data);
      setLoadingDuration(false);
    });

    run(async () => {
      setLoadingPeak(true);
      const r = await fetchData('/report/peak-entry-time');
      if (r?.data) setPeakData(r.data);
      setLoadingPeak(false);
    });

    // Load courses for dropdown
    run(async () => {
      const r = await fetchData('/report/users-by-course');
      if (r?.data) {
        setCourses(r.data.courses || []);
        setSelectedCourse(r.data.course || null);
        setCourseRows(r.data.results || []);
        setCourseTotal(r.data.total || 0);
      }
    });
  }, []);

  // Refetch when course changes
  useEffect(() => {
    if (!selectedCourse) return;
    const fetch = async () => {
      setLoadingCourse(true);
      const r = await fetchData(
        `/report/users-by-course?courseId=${selectedCourse._id}`,
      );
      if (r?.data) {
        setCourseRows(r.data.results || []);
        setCourseTotal(r.data.total || 0);
      }
      setLoadingCourse(false);
    };
    fetch();
  }, [selectedCourse?._id]);

  const maxCourseCount = courseRows.length
    ? Math.max(...courseRows.map((r) => r.count), 1)
    : 1;
  const topYearLevel = [...courseRows].sort((a, b) => b.count - a.count)[0];

  const pctChange = semesterRevenue?.percentageChange;
  const TrendBadge = ({ up }) => (
    <div
      className={`flex gap-1 items-center text-xs p-2 absolute top-5 right-5 rounded-lg border ${up ? 'text-green-500 bg-green-100 border-green-500' : 'text-rose-500 bg-rose-100 border-rose-500'}`}
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
            up
              ? 'M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941'
              : 'M2.25 6 9 12.75l4.286-4.286a11.948 11.948 0 0 1 4.306 6.43l.776 2.898m0 0 3.182-5.511m-3.182 5.51-5.511-3.181'
          }
        />
      </svg>
      <p>
        {pctChange !== undefined && pctChange !== null
          ? `${Math.abs(pctChange)}%`
          : '—'}
      </p>
    </div>
  );

  const handleGeneratePDF = () =>
    window.open('http://localhost:5000/report/generate', '_blank');

  const formatClock = (d) =>
    d.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });

  return (
    <>
      <header className='flex justify-between px-2 sm:px-5 pt-5 items-center'>
        <div className='flex flex-col'>
          <h1 className='font-bold text-3xl'>Reports & Analytics</h1>
          <p className='text-gray-400'>
            View and analyze system data through detailed reports and visual
            summaries.
          </p>
        </div>
        <button
          onClick={handleGeneratePDF}
          className='flex gap-2 px-4 py-2 rounded-md bg-green-100 text-green-500 ring ring-green-500'
        >
          <Printer strokeWidth={1.5} size={20} />
          <span>Generate PDF</span>
        </button>
      </header>

      {/* Summary Cards */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 h-[150px] px-2 sm:px-5 overflow-x-auto'>
        <ReportSummaryCard stats={stats} loading={loadingStats} />
      </div>

      {/* Revenue */}
      <div className={`rounded-xl h-auto mx-2 sm:mx-5 ${card}`}>
        <div className='flex flex-col gap-5 h-full p-3 sm:p-5'>
          <h1 className='text-base font-medium'>Revenue Per Month</h1>
          <div className='flex-1 flex flex-col h-[400px] gap-5'>
            <RevenueChart
              monthlyData={monthlyRevenue}
              loading={loadingMonthly}
            />
          </div>
          <div className='flex gap-3 sm:gap-5 h-full rounded-xl overflow-x-auto'>
            <div
              className={`flex flex-col justify-center gap-1 h-full ${cardInner} rounded-xl p-3 sm:p-5 flex-1 min-w-[200px] relative`}
            >
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
              {!loadingRevenue && pctChange !== undefined && (
                <TrendBadge up={pctChange < 0} />
              )}
            </div>
            <div
              className={`flex flex-col justify-center gap-1 h-full ${cardInner} rounded-xl p-3 sm:p-5 flex-1 min-w-[200px] relative`}
            >
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
              {!loadingRevenue && pctChange !== undefined && (
                <TrendBadge up={pctChange >= 0} />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Avg Parking Duration + Occupancy + Preferred Areas */}
      <div className='flex gap-3 sm:gap-5 mx-2 sm:mx-5 overflow-x-auto'>
        <div className={`rounded-xl h-full w-full ${card}`}>
          <div className='flex flex-col gap-2 p-3 sm:p-5 h-full'>
            <h1 className='text-base font-medium'>Average Parking Duration</h1>
            <div className='flex-1 min-h-[400px]'>
              <AvgParkingDurationChart
                chartData={avgParkingData}
                loading={loadingAvgParking}
              />
            </div>
          </div>
        </div>
        <div className='flex flex-col gap-5 min-w-[350px]'>
          <div className={`flex-1 self-start w-full rounded-xl ${card}`}>
            <div className='p-3 sm:p-5 h-full flex flex-col'>
              <h1 className='text-base font-medium'>Today's Motor Occupancy</h1>
              <div className='flex-1'>
                <MotorOccupancyChart
                  chartData={occupancyData}
                  loading={loadingOccupancy}
                />
              </div>
              <p className='text-gray-400 text-xs'>
                {occupancyData
                  ? `${occupancyData.values.reduce((a, b) => a + b, 0)} entries logged today`
                  : 'Loading...'}
              </p>
            </div>
          </div>
          <div className={`${card} rounded-xl p-3 sm:p-5 flex flex-col gap-4`}>
            <h1 className='font-medium text-base'>Preferred Parking Area</h1>
            {loadingAreas ? (
              Array.from({ length: 3 }, (_, i) => (
                <div
                  key={i}
                  className={`h-12 rounded-xl animate-pulse ${cardInner}`}
                />
              ))
            ) : preferredAreas.length === 0 ? (
              <p className='text-xs text-gray-400 text-center py-2'>
                No area data yet
              </p>
            ) : (
              preferredAreas.map((area, i) => (
                <div
                  key={i}
                  className={`relative p-4 ${cardInner} rounded-xl pl-12`}
                >
                  <span className='absolute left-0 top-0 bottom-0 w-10 flex items-center justify-center bg-blue-500 text-white font-semibold rounded-l-xl'>
                    {i + 1}
                  </span>
                  <p className={dark ? 'text-gray-300' : 'text-gray-700'}>
                    {area.name}
                  </p>
                  <p className='text-xs text-gray-400'>
                    {area.occupied} / {area.total} slots occupied
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Users per Course + Peak Entry + Parking Duration */}
      <div className='grid grid-cols-1 xl:grid-cols-2 gap-3 sm:gap-5 h-[500px] mx-2 sm:mx-5 mb-3 sm:mb-5 overflow-x-auto'>
        {/* Users per Course — dropdown = course, rows = year levels */}
        <div
          className={`${card} rounded-xl p-3 sm:p-5 flex flex-col flex-1 min-w-[400px] gap-5`}
        >
          <header className='flex items-center justify-between'>
            <h1 className='text-base font-medium'>
              Number of Users per Course
            </h1>
            <button
              onClick={() => setShowCourseList(!showCourseList)}
              className={`flex relative w-auto items-center gap-2 pr-2 pl-4 py-2 rounded-xl ring cursor-pointer ${dark ? 'ring-[#3a3a3a] text-gray-200 bg-[#3a3a3a]' : 'ring-gray-200 text-gray-700 bg-white'}`}
            >
              <p className='text-sm'>
                {selectedCourse?.name || 'Select Course'}
              </p>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth={1.5}
                stroke='currentColor'
                className={`${showCourseList ? 'rotate-180' : 'rotate-0'} size-4 duration-100`}
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='m19.5 8.25-7.5 7.5-7.5-7.5'
                />
              </svg>
              {showCourseList && (
                <div
                  className={`flex flex-col p-2 top-11 rounded-xl min-w-[140px] right-0 absolute ring z-20 ${dark ? 'bg-[#3a3a3a] ring-[#4a4a4a]' : 'bg-white ring-gray-200'}`}
                >
                  {courses.map((c) => (
                    <button
                      key={c._id}
                      onClick={() => {
                        setSelectedCourse(c);
                        setShowCourseList(false);
                      }}
                      className='p-2 rounded-lg hover:bg-blue-500 hover:text-white text-nowrap text-left text-sm'
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              )}
            </button>
          </header>
          <div className='flex-1 overflow-y-auto [scrollbar-width:none] flex flex-col gap-3'>
            {loadingCourse ? (
              Array.from({ length: 4 }, (_, i) => (
                <div
                  key={i}
                  className='py-2 flex items-center gap-5 animate-pulse'
                >
                  <div
                    className={`h-3 w-16 rounded ${dark ? 'bg-[#3a3a3a]' : 'bg-gray-200'}`}
                  />
                  <div
                    className={`rounded-xl flex-1 h-6 ${dark ? 'bg-[#3a3a3a]' : 'bg-gray-200'}`}
                  />
                  <div
                    className={`h-3 w-16 rounded ${dark ? 'bg-[#3a3a3a]' : 'bg-gray-200'}`}
                  />
                </div>
              ))
            ) : courseRows.length === 0 ? (
              <p className='text-center text-gray-400 text-sm py-8'>
                No data available
              </p>
            ) : (
              courseRows.map((row, i) => (
                <div key={i} className='py-1 flex items-center gap-4'>
                  <p
                    className={`w-10 text-sm font-medium ${dark ? 'text-gray-300' : 'text-gray-700'}`}
                  >
                    {row.yearLevel}
                  </p>
                  <div
                    className={`rounded-xl overflow-hidden relative ${cardInner} flex-1 h-[24px]`}
                  >
                    <span
                      className='h-full top-0 left-0 rounded-s-xl absolute bg-blue-500 transition-all duration-500'
                      style={{
                        width: `${Math.round((row.count / maxCourseCount) * 100)}%`,
                      }}
                    />
                  </div>
                  <p className='w-16 sm:w-[70px] text-right text-sm text-nowrap'>
                    {row.count} Users
                  </p>
                </div>
              ))
            )}
          </div>
          <div className={`rounded-xl p-4 ${cardInner} flex flex-col gap-1`}>
            {topYearLevel && topYearLevel.count > 0 ? (
              <>
                <h4
                  className={`text-sm font-semibold ${dark ? 'text-gray-200' : 'text-gray-900'}`}
                >
                  Top Year Level
                </h4>
                <p
                  className={`text-2xl font-bold ${dark ? 'text-gray-100' : 'text-gray-900'}`}
                >
                  {topYearLevel.yearLevel} Year{' '}
                  <span
                    className={`text-base font-medium ${dark ? 'text-gray-300' : 'text-gray-700'}`}
                  >
                    · {topYearLevel.count} users
                  </span>
                </p>
                <p className='text-xs text-gray-400'>
                  Represents{' '}
                  <span
                    className={`font-semibold ${dark ? 'text-gray-300' : 'text-gray-700'}`}
                  >
                    {courseTotal
                      ? Math.round((topYearLevel.count / courseTotal) * 100)
                      : 0}
                    %
                  </span>{' '}
                  of {selectedCourse?.name || 'course'} students
                </p>
              </>
            ) : (
              <p className='text-xs text-gray-400 text-center'>
                No data for this course
              </p>
            )}
          </div>
        </div>

        <div className='flex flex-col gap-5 flex-1 min-w-[300px]'>
          {/* Peak Entry Time */}
          <div
            className={`${card} flex flex-col gap-3 relative p-3 sm:p-5 rounded-xl flex-1`}
          >
            <header className='flex flex-col'>
              <h1 className='text-base font-medium'>Peak User Entry Time</h1>
              <p className='text-xs text-gray-400'>
                Most users enter at this time
              </p>
            </header>
            <div className='text-right flex flex-col absolute top-5 right-5'>
              <h1
                className={`font-medium text-xl tabular-nums ${dark ? 'text-gray-100' : 'text-gray-900'}`}
              >
                {formatClock(clock)}
              </h1>
              {loadingPeak ? (
                <p className='text-xs text-gray-400'>Loading...</p>
              ) : peakData?.peakTime ? (
                <>
                  <p
                    className={`text-sm font-semibold ${dark ? 'text-blue-400' : 'text-blue-600'}`}
                  >
                    Peak: {peakData.peakTime}
                  </p>
                  <p className='text-xs text-gray-400'>
                    {peakData.peakPct}% of daily entries
                  </p>
                </>
              ) : (
                <p className='text-xs text-gray-400'>No entry data yet</p>
              )}
            </div>
            <div className='flex gap-3 items-center flex-1'>
              <div className='flex flex-col gap-1'>
                <p
                  className={`text-sm ${dark ? 'text-gray-300' : 'text-gray-700'}`}
                >
                  {loadingPeak ? '—' : peakData?.peakArea || 'No area data'}
                </p>
                <p className='text-xs text-gray-400'>Most active area</p>
              </div>
              <div className='flex-1 h-full flex items-center justify-center'>
                <MotorOccupancyChart
                  chartData={occupancyData}
                  loading={loadingOccupancy}
                />
              </div>
            </div>
          </div>

          {/* Users Parking Duration */}
          <div
            className={`${card} rounded-xl overflow-hidden p-3 sm:p-5 flex flex-col gap-4`}
          >
            <header className='flex justify-between items-center'>
              <h1 className='text-base font-medium'>Users Parking Duration</h1>
              <p className='text-xs text-gray-400'>Total mins · last 30 days</p>
            </header>
            <div className='flex flex-col gap-2 w-full overflow-y-auto [scrollbar-width:none]'>
              {loadingDuration ? (
                Array.from({ length: 4 }, (_, i) => (
                  <div
                    key={i}
                    className='flex items-center gap-3 animate-pulse'
                  >
                    <div
                      className={`h-3 w-24 rounded ${dark ? 'bg-[#3a3a3a]' : 'bg-gray-200'}`}
                    />
                    <div
                      className={`rounded-xl flex-1 h-[18px] ${dark ? 'bg-[#3a3a3a]' : 'bg-gray-200'}`}
                    />
                    <div
                      className={`h-3 w-12 rounded ${dark ? 'bg-[#3a3a3a]' : 'bg-gray-200'}`}
                    />
                  </div>
                ))
              ) : topDuration.length === 0 ? (
                <p className='text-xs text-gray-400 text-center py-4'>
                  No parking data yet
                </p>
              ) : (
                topDuration.map((u, i) => (
                  <div className='flex items-center gap-3' key={i}>
                    <p
                      className={`w-32 sm:w-[140px] text-sm truncate ${dark ? 'text-gray-300' : 'text-gray-700'}`}
                    >
                      {u.name}
                    </p>
                    <div
                      className={`rounded-xl overflow-hidden relative ${cardInner} flex-1 h-[18px]`}
                    >
                      <span
                        className='h-full top-0 left-0 rounded-s-xl absolute bg-green-500'
                        style={{ width: `${u.pct}%` }}
                      />
                    </div>
                    <p className='w-12 sm:w-[60px] text-right text-sm'>
                      {u.duration}m
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
