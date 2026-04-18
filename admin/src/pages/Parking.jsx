import ReportSummaryCard from '../components/charts/ReportSummaryCard';
import AdminBldg from '../components/maps/AdminBldg';
import DynamicMap from '../components/maps/DynamicMap';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import Modal from '../components/Modal';
import { useState, useEffect } from 'react';
import useFetch from '../hooks/useFetch';
import Details from '../components/Parking/Details';
import { QrCode, Eye, X } from 'lucide-react';
import useDark from '../hooks/useDark';

export default function Parking() {
  const [reports, setReports] = useState([]);
  const [isOpen, toggleIsOpenModal] = useState(false);
  const [mapError, setMapError] = useState(false);
  const [areaName, setAreaName] = useState('');
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [maps, setMaps] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedShape, setSelectedShape] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [showMessage, setShowMessage] = useState(false);
  const [selectedMap, setSelectedMap] = useState(null);
  const [slotQRBtn, toggleSlotQRBtn] = useState(false);
  const [confirmDeleteMap, setConfirmDeleteMap] = useState(false);
  const [isPreview, setIsPreview] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { fetchData, loading } = useFetch();
  const { dark, border, input } = useDark();

  useEffect(() => {
    const fetchMaps = async () => {
      try {
        const data = await fetchData('map/with-shapes', {
          method: 'GET',
        });
        setMaps(data || []);
        setSelectedMap(data[currentIndex]);
      } catch (error) {
        console.error('Error fetching maps:', error);
        setMaps([]);
      }
    };
    fetchMaps();

    if (location.state?.message) {
      setSuccessMessage(location.state.message);
      setShowMessage(true);

      const timer = setTimeout(() => {
        setShowMessage(false);
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [location.state?.message]);

  useEffect(() => {
    if (maps && maps.length > 0 && currentIndex >= maps.length) {
      setCurrentIndex(0);
    }
    setSelectedMap(maps[currentIndex]);
    const currentMap = maps[currentIndex];
    if (!currentMap?.shapes) return;

    setSelectedMap(currentMap);

    const selectedMapSlots = currentMap.shapes.filter(
      (s) => s.metadata?.type === 'slot',
    );
    if (selectedMapSlots.length > 0) {
      toggleSlotQRBtn(true);
    }
  }, [maps, currentIndex]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!areaName || !height || !width)
      return setMapError('All fields must be filled');

    if (areaName.length > 30) {
      return setMapError('Maximum name length is 30');
    }
    if (height > 500) return setMapError('Maximum height allowed is 500px');
    if (width > 1200) return setMapError('Maximum width allowed is 1200px');

    navigate('/map-editor', {
      state: {
        areaName,
        svgSize: { width: Number(width), height: Number(height) },
      },
    });
    toggleIsOpenModal(false);
  };

  const handleShapeClick = (shape) => {
    setSelectedShape(shape);
  };

  const handleDeleteMap = async () => {
    if (!selectedMap?._id) return;
    try {
      await fetchData(`/map/${selectedMap._id}`, { method: 'DELETE' });
      const updated = maps.filter((m) => m._id !== selectedMap._id);
      setMaps(updated);
      setCurrentIndex(0);
      setSelectedMap(updated[0] || null);
      setConfirmDeleteMap(false);
      setSuccessMessage('Map deleted successfully!');
      setShowMessage(true);
      setTimeout(() => setShowMessage(false), 4000);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    const parkingSummary = async () => {
      const res = await fetchData('/report/parking-summary', {
        method: 'GET',
      });

      if (res) {
        setReports(res.reports);
        console.log(res);
      }
    };
    parkingSummary();
  }, []);

  return (
    <>
      {/* Success Message Toast */}
      {showMessage && (
        <div className='fixed top-5 right-5 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 z-50 animate-pulse'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth={1.5}
            stroke='currentColor'
            className='size-5'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
            />
          </svg>
          {successMessage}
        </div>
      )}
      {/* Header Page */}
      <header className='flex justify-between px-5 pt-5 items-center'>
        <div className='flex flex-col'>
          <h1 className='font-bold text-3xl'>Parking Management</h1>
          <p className='text-gray-400'>
            View and analyze system data through detailed reports and visual
            summaries.
          </p>
        </div>
        {/* Quick Actions (will update) */}
        <div className='flex gap-5'></div>
      </header>
      {/* Parking Report Summary */}
      <div className='flex gap-5 h-[150px] px-5'>
        <ReportSummaryCard reports={reports} loading={loading} />
      </div>
      {/* Parking Map and Details */}
      <div className={`flex flex-col mx-5 border rounded-xl mb-5 ${border}`}>
        {/* Header Parking Section */}
        <header
          className={`flex justify-between p-5 border-b w-full ${border}`}
        >
          <div className='flex gap-3 items-center'>
            <h2 className='font-medium text-base'>Parking Area Overview</h2>
            <p className='text-xs py-2 px-4 rounded-lg ring ring-blue-500 bg-blue-100 text-blue-500'>
              Beta
            </p>
          </div>
          <div className='flex items-center gap-3'>
            {/* Redirect to Map Editor */}
            <button
              onClick={() => toggleIsOpenModal(true)}
              className='flex items-center gap-1 py-2 px-3 rounded-full bg-blue-500 text-white'
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
                  d='m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25'
                />
              </svg>
              <p>Create New Area</p>
            </button>
            {isOpen && (
              <Modal onClose={() => toggleIsOpenModal(false)}>
                <div className='text-xs w-[450px] flex flex-col gap-5'>
                  <h1
                    className={`text-base font-semibold ${dark ? 'text-gray-200' : 'text-gray-700'}`}
                  >
                    Create New Area
                  </h1>
                  <form onSubmit={handleSubmit} className='flex flex-col gap-5'>
                    <div className='flex flex-col gap-1'>
                      <label
                        htmlFor='name'
                        className='self-start text-xs text-gray-400'
                      >
                        Area name
                      </label>
                      <input
                        id='name'
                        type='text'
                        value={areaName}
                        placeholder='Admin Bldg (FRONT)'
                        onChange={(e) => setAreaName(e.target.value)}
                        className={`outline-none p-4 w-full rounded-md border ${input}`}
                      />
                    </div>
                    <div className='flex gap-3 items-center'>
                      <div className='flex flex-1 flex-col gap-1'>
                        <label
                          htmlFor='height'
                          className='self-start text-xs text-gray-400'
                        >
                          Height
                        </label>
                        <div className='flex gap-1 items-end'>
                          <input
                            id='height'
                            type='number'
                            placeholder='Recommended: 350px'
                            value={height}
                            onChange={(e) => setHeight(e.target.value)}
                            className={`outline-none p-4 w-full rounded-md border ${input}`}
                          />
                          <span className='text-gray-400'>px</span>
                        </div>
                      </div>
                      <div className='flex flex-1 flex-col gap-1'>
                        <label
                          htmlFor='width'
                          className='self-start text-xs text-gray-400'
                        >
                          Width
                        </label>
                        <div className='flex gap-1 items-end'>
                          <input
                            id='width'
                            type='number'
                            value={width}
                            placeholder='Recommended: 1000px'
                            onChange={(e) => setWidth(e.target.value)}
                            className={`outline-none p-4 w-full rounded-md border ${input}`}
                          />
                          <span className='text-gray-400'>px</span>
                        </div>
                      </div>
                    </div>
                    {mapError && (
                      <p className='text-xs text-red-500'>{mapError}</p>
                    )}
                    <div className='flex items-center gap-5 w-full'>
                      <button
                        type='button'
                        onClick={() => toggleIsOpenModal(false)}
                        className={`border w-full py-2 px-4 rounded ${dark ? 'border-[#4a4a4a] text-gray-300' : 'border-gray-200 text-gray-700'}`}
                      >
                        Close
                      </button>
                      <button
                        type='submit'
                        className='bg-blue-500 w-full text-white py-2 px-4 rounded'
                      >
                        Create
                      </button>
                    </div>
                  </form>
                </div>
              </Modal>
            )}

            {slotQRBtn && (
              <Link
                to={`/parking/map/${selectedMap?._id}/slots`}
                className='flex gap-2 items-center text-white p-2 rounded-full bg-blue-500'
              >
                <QrCode strokeWidth={1.5} size={20} />
                <span>Slots QR Code</span>
              </Link>
            )}
            {/* Manage Slots */}
            <button
              onClick={() => {
                if (maps && maps.length > 0) {
                  navigate('/map-editor', {
                    state: {
                      areaName: maps[currentIndex].name,
                      svgSize: {
                        width: maps[currentIndex].width,
                        height: maps[currentIndex].height,
                      },
                      shapes: maps[currentIndex].shapes,
                      mapId: maps[currentIndex]._id,
                      isUpdate: true,
                    },
                  });
                }
              }}
              className='flex items-center gap-1 py-2 px-3 rounded-full text-blue-500 border-blue-500 border'
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
                  d='M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z'
                />
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z'
                />
              </svg>
              <p>Manage</p>
            </button>
            {/* Preview */}
            {maps && maps.length > 0 && (
              <button
                onClick={() => setIsPreview(true)}
                className={`flex items-center gap-1 py-2 px-3 rounded-full border transition ${dark ? 'border-[#3a3a3a] text-gray-300' : 'border-blue-500 text-blue-500'}`}
              >
                <Eye size={16} strokeWidth={1.5} />
                <p>Preview</p>
              </button>
            )}
            {/* Delete Map */}
            {maps && maps.length > 0 && (
              <button
                onClick={() => setConfirmDeleteMap(true)}
                className='flex items-center gap-1 py-2 px-3 rounded-full text-rose-500 border-rose-400 border hover:bg-rose-50 transition'
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
                    d='m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0'
                  />
                </svg>
                <p>Delete Map</p>
              </button>
            )}
            {confirmDeleteMap && (
              <Modal onClose={() => setConfirmDeleteMap(false)}>
                <div className='flex flex-col gap-4 w-[360px]'>
                  <div className='flex items-center gap-3'>
                    <div className='p-2 rounded-full bg-rose-50'>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        fill='none'
                        viewBox='0 0 24 24'
                        strokeWidth={1.5}
                        stroke='currentColor'
                        className='size-5 text-rose-500'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          d='M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z'
                        />
                      </svg>
                    </div>
                    <h2 className='font-semibold text-gray-800'>Delete Map</h2>
                  </div>
                  <p className='text-sm text-gray-500'>
                    Are you sure you want to delete{' '}
                    <strong>{selectedMap?.name}</strong>? All shapes, slots, and
                    user assignments will be permanently removed.
                  </p>
                  <div className='flex gap-3'>
                    <button
                      onClick={() => setConfirmDeleteMap(false)}
                      className={`flex-1 py-2 rounded-xl border text-sm transition ${dark ? 'border-[#4a4a4a] text-gray-400 hover:bg-[#3a3a3a]' : 'border-gray-200 text-gray-500 hover:bg-gray-50'}`}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleDeleteMap}
                      disabled={loading}
                      className='flex-1 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-sm text-white transition disabled:opacity-60'
                    >
                      {loading ? 'Deleting...' : 'Yes, Delete'}
                    </button>
                  </div>
                </div>
              </Modal>
            )}
          </div>
        </header>
        {/* Content */}
        <main className='flex flex-1'>
          {/* Map */}
          <section className='relative px-5 py-20 flex-1'>
            {/* Change Parking Area */}
            <svg
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              strokeWidth={1.5}
              stroke='currentColor'
              className={`size-6 absolute right-5 -translate-x-1/2 top-1/2 ${maps && maps.length > 1 ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'}`}
              onClick={() =>
                maps &&
                maps.length > 1 &&
                setCurrentIndex((prev) => (prev + 1) % maps.length)
              }
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='m8.25 4.5 7.5 7.5-7.5 7.5'
              />
            </svg>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              strokeWidth={1.5}
              stroke='currentColor'
              className={`size-6 absolute left-10 top-1/2 -translate-x-1/2 ${maps && maps.length > 1 ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'}`}
              onClick={() =>
                maps &&
                maps.length > 1 &&
                setCurrentIndex(
                  (prev) => (prev - 1 + maps.length) % maps.length,
                )
              }
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M15.75 19.5 8.25 12l7.5-7.5'
              />
            </svg>
            {/* Legends */}
            <div className='flex items-center justify-between absolute top-5 right-5'>
              <div className='flex gap-3'>
                <div
                  className={`flex items-center gap-1 text-xs ${dark ? 'text-gray-400' : 'text-gray-400'}`}
                >
                  <div className='relative flex items-center justify-center w-10 h-10'>
                    <div className='absolute w-9 h-9 rounded-full bg-green-100 opacity-50 z-10'></div>
                    <div className='absolute w-6 h-6 rounded-full bg-green-300 opacity-[.3] z-0'></div>
                    <div className='relative w-3 h-3 rounded-full bg-green-500'></div>
                  </div>
                  <p>Available</p>
                </div>
                <div
                  className={`flex items-center gap-1 text-xs ${dark ? 'text-gray-400' : 'text-gray-400'}`}
                >
                  <div className='relative flex items-center justify-center w-10 h-10'>
                    <div className='absolute w-9 h-9 rounded-full bg-rose-100 opacity-50 z-10'></div>
                    <div className='absolute w-6 h-6 rounded-full bg-rose-300 opacity-[.3] z-0'></div>
                    <div className='relative w-3 h-3 rounded-full bg-rose-500'></div>
                  </div>
                  <p>Occupied</p>
                </div>
                <div
                  className={`flex items-center gap-1 text-xs ${dark ? 'text-gray-400' : 'text-gray-400'}`}
                >
                  <div className='relative flex items-center justify-center w-10 h-10'>
                    <div className='absolute w-9 h-9 rounded-full bg-blue-100 opacity-50 z-10'></div>
                    <div className='absolute w-6 h-6 rounded-full bg-blue-300 opacity-[.3] z-0'></div>
                    <div className='relative w-3 h-3 rounded-full bg-blue-500'></div>
                  </div>
                  <p>Exclusive</p>
                </div>
              </div>
            </div>
            {/* Area name */}
            <p className='text-center px-4 py-2 bg-blue-100 text-xs text-blue-500 absolute bottom-5 right-5 rounded-xl ring ring-blue-500'>
              {(maps && maps[currentIndex]?.name) || 'No Area'}
            </p>
            <div className='h-full min-h-96 flex items-center justify-center'>
              {maps && maps.length > 0 ? (
                <DynamicMap
                  shapes={maps[currentIndex].shapes}
                  width={maps[currentIndex].width}
                  height={maps[currentIndex].height}
                  onShapeClick={handleShapeClick}
                />
              ) : (
                <div className='text-center text-gray-400'>
                  No parking areas available
                </div>
              )}
            </div>
          </section>
          {/* Parking Details */}
          <Details selectedShape={selectedShape} loading={loading} />
        </main>
      </div>
      {isPreview && selectedMap && (
        <div
          className='fixed inset-0 z-50 flex flex-col'
          style={{ background: dark ? '#1a1a1a' : '#f3f4f6' }}
        >
          {/* Top bar */}
          <div
            className={`flex items-center justify-between px-6 py-3 border-b shrink-0 ${dark ? 'bg-[#242424] border-[#3a3a3a]' : 'bg-white border-gray-200'}`}
          >
            <div className='flex items-center gap-3'>
              <span
                className={`font-semibold text-sm ${dark ? 'text-gray-200' : 'text-gray-700'}`}
              >
                {selectedMap.name}
              </span>
              <span className='text-[11px] px-2 py-0.5 rounded-full bg-blue-100 text-blue-600 border border-blue-200'>
                Preview
              </span>
            </div>
            <div className='flex items-center gap-4'>
              {/* Legend */}
              <div className='flex items-center gap-4'>
                {[
                  ['#22c55e', 'Available'],
                  ['#f43f5e', 'Occupied'],
                  ['#3b82f6', 'Exclusive'],
                ].map(([color, label]) => (
                  <div
                    key={label}
                    className={`flex items-center gap-1.5 text-xs ${dark ? 'text-gray-400' : 'text-gray-500'}`}
                  >
                    <div
                      className='w-2.5 h-2.5 rounded-full'
                      style={{ background: color }}
                    />
                    <span>{label}</span>
                  </div>
                ))}
              </div>
              <button
                onClick={() => setIsPreview(false)}
                className={`p-1.5 rounded-lg text-gray-400 transition ${dark ? 'hover:bg-[#3a3a3a]' : 'hover:bg-gray-100'}`}
              >
                <X size={18} />
              </button>
            </div>
          </div>
          {/* Full-screen map */}
          <div className='flex-1 flex items-center justify-center p-8'>
            <div style={{ width: '100%', height: '100%' }}>
              <DynamicMap
                shapes={selectedMap.shapes}
                width={selectedMap.width}
                height={selectedMap.height}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
