import { Link, useNavigate } from 'react-router-dom';
import ReportSummaryCard from '../components/charts/ReportSummaryCard';
import RevenueChart from '../components/charts/RevenueChart';
import AvgParkingDurationChart from '../components/charts/AvgParkingDurationChart';
import MotorOccupancyChart from '../components/charts/MotorOccupancyChart';
import { useState, useEffect } from 'react';
import useFetch from '../hooks/useFetch';
import { useSelector } from 'react-redux';
import { CircleUserRound, Plus } from 'lucide-react';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [availableSlots, setAvailableSlots] = useState(0);
  const [loadingStats, setLoadingStats] = useState(true);
  const [semesterRevenue, setSemesterRevenue] = useState(null);
  const [loadingRevenue, setLoadingRevenue] = useState(true);
  const [semesterChartData, setSemesterChartData] = useState(null);
  const [loadingMonthly, setLoadingMonthly] = useState(true);
  const [guards, setGuards] = useState([]);
  const [loadingGuards, setLoadingGuards] = useState(true);
  const [occupancyData, setOccupancyData] = useState(null);
  const [loadingOccupancy, setLoadingOccupancy] = useState(true);
  const [avgParkingData, setAvgParkingData] = useState(null);
  const [loadingAvgParking, setLoadingAvgParking] = useState(true);
  const { fetchData } = useFetch();
  const navigate = useNavigate();
  const { theme } = useSelector((s) => s.auth);
  const dark = theme === 'dark';

  const card = dark ? 'bg-[#2f2f2f]' : 'bg-gray-100';
  const cardInner = dark ? 'bg-[#3a3a3a]' : 'bg-white';
  const border = dark ? 'border-[#3a3a3a]' : 'border-gray-200';
  const subText = dark ? 'text-gray-400' : 'text-gray-400';

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
        if (response?.data) setSemesterRevenue(response.data);
      } catch (err) {
        console.error('Failed to fetch semester revenue:', err);
      } finally {
        setLoadingRevenue(false);
      }
    };

    const fetchMonthlyRevenue = async () => {
      try {
        setLoadingMonthly(true);
        const response = await fetchData('/semester/revenue/chart');
        if (response?.data) setSemesterChartData(response.data);
      } catch (err) {
        console.error('Failed to fetch semester revenue chart:', err);
      } finally {
        setLoadingMonthly(false);
      }
    };

    const fetchGuards = async () => {
      try {
        setLoadingGuards(true);
        const response = await fetchData('/user/guards');
        if (response)
          setGuards(Array.isArray(response) ? response : response.data || []);
      } catch (err) {
        console.error('Failed to fetch guards:', err);
      } finally {
        setLoadingGuards(false);
      }
    };

    const fetchOccupancy = async () => {
      try {
        setLoadingOccupancy(true);
        const res = await fetchData('/report/occupancy-by-hour');
        if (res?.data) setOccupancyData(res.data);
      } catch (err) {
      } finally {
        setLoadingOccupancy(false);
      }
    };

    const fetchAvgParking = async () => {
      try {
        setLoadingAvgParking(true);
        const res = await fetchData('/report/avg-parking-by-hour');
        if (res?.data) setAvgParkingData(res.data);
      } catch (err) {
      } finally {
        setLoadingAvgParking(false);
      }
    };

    fetchSystemSummary();
    fetchSemesterRevenue();
    fetchMonthlyRevenue();
    fetchGuards();
    fetchOccupancy();
    fetchAvgParking();
  }, []);

  return (
    <>
      <header className='flex justify-between px-5 pt-5 items-center'>
        <div className='flex flex-col'>
          <h1 className='font-bold text-3xl'>Dashboard</h1>
          <p className={subText}>Here's the data summarization of the system</p>
        </div>
      </header>

      {/* Summary Cards */}
      <div className='grid grid-cols-2 lg:grid-cols-4 gap-5 h-[150px] px-5'>
        <ReportSummaryCard stats={stats} loading={loadingStats} />
      </div>

      {/* Mid Section */}
      <div className='flex gap-5 px-5'>
        {/* Revenue Chart */}
        <div className={`rounded-xl flex-1 h-auto ${card}`}>
          <div className='flex flex-col gap-5 h-full p-5'>
            <h1 className='text-base font-medium'>Revenue Per Semester</h1>
            <div className='w-full h-[300px]'>
              <RevenueChart
                monthlyData={semesterChartData}
                loading={loadingMonthly}
              />
            </div>
            <div className='flex gap-5 rounded-xl'>
              <div
                className={`flex flex-col gap-1 h-full ${cardInner} rounded-xl p-5 flex-1`}
              >
                <p className='text-xs font-semibold text-gray-400 uppercase tracking-wide'>
                  Previous Semester
                </p>
                <p
                  className={`text-sm font-medium ${dark ? 'text-gray-200' : 'text-gray-700'}`}
                >
                  {loadingRevenue
                    ? 'Loading...'
                    : semesterRevenue?.lastSemester?.name || '—'}
                </p>
                <p className='font-semibold text-2xl'>
                  &#8369;{' '}
                  {loadingRevenue
                    ? '...'
                    : (
                        semesterRevenue?.lastSemester?.revenue || 0
                      ).toLocaleString()}
                </p>
              </div>
              <div
                className={`flex flex-col gap-1 h-full ${cardInner} rounded-xl p-5 flex-1`}
              >
                <p className='text-xs font-semibold text-blue-500 uppercase tracking-wide'>
                  Current Semester
                </p>
                <p
                  className={`text-sm font-medium ${dark ? 'text-gray-200' : 'text-gray-700'}`}
                >
                  {loadingRevenue
                    ? 'Loading...'
                    : semesterRevenue?.currentSemester?.name || '—'}
                </p>
                <p className='font-semibold text-2xl'>
                  &#8369;{' '}
                  {loadingRevenue
                    ? '...'
                    : (
                        semesterRevenue?.currentSemester?.revenue || 0
                      ).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className='w-[300px] flex flex-col gap-5'>
          {/* Parking Slots */}
          <div className='flex-1 w-full rounded-xl bg-gradient-to-tl to-blue-500 via-blue-900 from-[#2d2d2d]'>
            <div className='p-5 h-full flex flex-col text-white justify-between'>
              <h1 className='font-medium text-base'>Parking Slots</h1>
              <h2 className='text-center mt-5'>
                <span className='text-6xl font-medium'>{availableSlots}</span>
                <br /> slots available
              </h2>
              <Link
                to='/parking'
                className='bg-white rounded-xl text-center py-4 font-medium mt-5 text-gray-700 hover:bg-gray-100 transition-colors'
              >
                View Map
              </Link>
            </div>
          </div>
          {/* Motor Occupancy */}
          <div className={`flex-1 w-full rounded-xl ${card}`}>
            <div className='p-5 h-full flex flex-col'>
              <h1 className='text-base font-medium'>Today's Motor Occupancy</h1>
              <div className='h-full w-full'>
                <MotorOccupancyChart
                  chartData={occupancyData}
                  loading={loadingOccupancy}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className='flex gap-5 px-5 pb-5'>
        {/* Avg Parking Duration */}
        <div className={`rounded-xl flex-3 h-auto ${card}`}>
          <div className='flex flex-col gap-2 p-5'>
            <h1 className='text-base font-medium'>Average Parking Duration</h1>
            <div style={{ position: 'relative', height: '280px', width: '100%' }}>
              <AvgParkingDurationChart
                chartData={avgParkingData}
                loading={loadingAvgParking}
              />
            </div>
          </div>
        </div>

        {/* Security Guards */}
        <div className={`flex flex-col rounded-xl ${card} flex-1`}>
          <div className='mt-5 mb-3 mx-5 flex items-center justify-between'>
            <h1 className='text-base font-medium'>Security Guards</h1>
            <Link
              to='/add-guard'
              className='py-2 px-4 rounded-full bg-transparent ring ring-blue-500 text-blue-500 flex items-center gap-2 hover:bg-blue-500 hover:text-white transition-colors'
            >
              <Plus size={16} />
              <p>New</p>
            </Link>
          </div>
          <div className='max-h-[280px] overflow-y-auto [scrollbar-width:none] flex flex-col'>
            {loadingGuards ? (
              Array.from({ length: 4 }, (_, i) => (
                <div
                  key={i}
                  className='flex gap-3 p-2 mx-3 items-center rounded-xl animate-pulse'
                >
                  <div className={`h-12 w-12 rounded-full ${cardInner}`}></div>
                  <div className='flex flex-col gap-1 flex-1'>
                    <div className={`h-3 w-32 rounded ${cardInner}`}></div>
                    <div className={`h-2 w-20 rounded ${cardInner}`}></div>
                  </div>
                </div>
              ))
            ) : guards.length === 0 ? (
              <p className={`text-center text-sm ${subText} py-6`}>
                No guards found
              </p>
            ) : (
              guards.slice(0, 5).map((guard) => (
                <div
                  key={guard._id}
                  onClick={() => navigate(`/users/${guard._id}`)}
                  className={`flex gap-3 p-2 mx-3 cursor-pointer items-center rounded-xl ${dark ? 'hover:bg-[#3a3a3a]' : 'hover:bg-gray-200'}`}
                >
                  {guard.profileDetails?.url ? (
                    <img
                      src={guard.profileDetails.url}
                      alt=''
                      className='h-12 w-12 object-cover rounded-full'
                    />
                  ) : (
                    <CircleUserRound size={48} className={subText} />
                  )}
                  <div className='flex flex-col'>
                    <h2 className='font-medium'>
                      {guard.name?.firstName} {guard.name?.lastName}
                    </h2>
                    <p className='text-green-500 text-xs'>On duty</p>
                  </div>
                </div>
              ))
            )}
          </div>
          <Link
            to='/users?role=guard'
            className='bg-blue-500 mt-3 mb-5 rounded-xl py-4 text-white mx-5 font-medium text-center hover:bg-blue-600 transition-colors'
          >
            View All Guards
          </Link>
        </div>
      </div>
    </>
  );
}
