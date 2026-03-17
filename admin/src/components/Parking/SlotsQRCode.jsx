import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import useFetch from '../../hooks/useFetch';
import { ChevronLeft, Printer } from 'lucide-react';

export default function SlotsQRCode() {
  const { mapId } = useParams();
  const navigate = useNavigate();
  const { loading, setError, error, fetchData } = useFetch();
  const [mapSlots, setMapSlots] = useState([]);
  const [mapData, setMapData] = useState([]);

  if (!mapId) return navigate('/parking', { replace: true });

  useEffect(() => {
    const getMapSlots = async () => {
      const map = await fetchData(`/map/${mapId}/slots/qr-code`, {
        method: 'GET',
      });
      if (map?.slots.length > 0) {
        setMapData(map.metadata);
        return setMapSlots(map?.slots);
      }
      setError(map.error);
    };
    getMapSlots();
  }, []);

  const handleGeneratePDF = async () => {
    window.open(
      `http://localhost:5000/report/generate/map/${mapId}/slots/qr-code`,
      '_blank',
    );
  };

  return (
    <>
      <header className='flex justify-between px-5 pt-5 items-center'>
        <div className='flex flex-col'>
          <Link
            to={'/parking'}
            className='flex mb-2 cursor-pointer gap-2 items-center text-violet-500'
          >
            <ChevronLeft size={15} />
            <span>Parking</span>
          </Link>
          <h1 className='font-bold text-3xl'>({mapData.name}) Slot Details</h1>
          <p className='text-gray-400'>View and print the slots qr code.</p>
        </div>
        <button
          onClick={handleGeneratePDF}
          className='py-2 bg-green-100 text-green-500 border border-green-500 rounded-md cursor-pointer hover:opacity-80 px-4 flex gap-3 items-center'
        >
          <Printer strokeWidth={1.5} />
          <span>Print Slots QR Code</span>
        </button>
      </header>
      <section className='flex items-center flex-wrap gap-5 p-5'>
        {loading ? (
          <div className='flex-1 flex items-center justify-center'>
            <div className='border-2 mt-30 border-t-violet-500 border-violet-100 h-12 w-12 rounded-full animate-spin'></div>
          </div>
        ) : mapSlots.length > 0 ? (
          mapSlots.map((slot, _) => (
            <li
              key={slot.shapeId}
              className='flex gap-3 text-gray-600 font-semibold flex-col max-w-48 h-48 bg-gray-100 p-2 rounded-md'
            >
              <img
                src={slot.QRCode?.url}
                alt={slot.slotId?.metadata?.label}
                className='w-full h-auto object-contain'
              />
              <span>{slot.slotId?.metadata?.label}</span>
            </li>
          ))
        ) : (
          <div className='flex flex-1 items-center justify-center'>
            <p className='text-center mt-30 text-gray-400'>
              No slots for this map
            </p>
          </div>
        )}
      </section>
    </>
  );
}
