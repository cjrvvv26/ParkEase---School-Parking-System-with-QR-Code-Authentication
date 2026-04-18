import React, { useState } from 'react';
import useFetch from '../../hooks/useFetch';
import useDark from '../../hooks/useDark';

const SLOT_COLORS = {
  exclusive: { light: '#dbeafe', dark: '#1e3a5f' },
  occupied:  { light: '#ffe4e6', dark: '#7f1d1d' },
  available: { light: '#dcfce7', dark: '#14532d' },
  structure: { light: '#E5E7EB', dark: '#3a3a3a' },
};

function getSlotFill(shape, dark) {
  if (shape.metadata?.type !== 'slot') {
    return dark ? SLOT_COLORS.structure.dark : SLOT_COLORS.structure.light;
  }
  const mode = dark ? 'dark' : 'light';
  const status = shape.slotStatus || shape.status;
  if (status === 'occupied' || shape.occupiedBy) return SLOT_COLORS.occupied[mode];
  if (status === 'exclusive' || shape.assignedStudentId) return SLOT_COLORS.exclusive[mode];
  return SLOT_COLORS.available[mode];
}

export default function DynamicMap({ shapes, width = 800, height = 600, onShapeClick }) {
  const { fetchData } = useFetch();
  const { dark, canvasBg } = useDark();
  const [selectedId, setSelectedId] = useState(null);

  const handleSlotDetails = async (shape) => {
    const id = shape._id || shape.tempId;
    setSelectedId((prev) => (prev === id ? null : id));
    if (!onShapeClick) return;
    if (shape.metadata?.type === 'slot') {
      const data = await fetchData('slot', { method: 'POST', data: { _id: shape._id } });
      const { createdAt, updatedAt, __v, _id, slotId, ...slotData } = data.slot;
      return onShapeClick({ ...shape, ...slotData });
    }
    if (shape.metadata?.type === 'building' && shape._id) {
      // Fetch fresh shape data from server to get the latest picture URL
      const data = await fetchData(`shape/${shape._id}`, { method: 'GET' }).catch(() => null);
      if (data?.shape) {
        return onShapeClick({ ...shape, metadata: data.shape.metadata });
      }
    }
    onShapeClick({ ...shape });
  };

  const renderShape = (shape) => {
    const fill = getSlotFill(shape, dark);
    const id = shape._id || shape.tempId;
    const isSelected = selectedId === id;
    const stroke = isSelected ? '#3b82f6' : dark ? '#4a4a4a' : '#d1d5dc';
    const strokeWidth = isSelected ? '2' : '1';

    if (shape.geometry.shape === 'rect') {
      const cx = shape.geometry.x + shape.geometry.width / 2;
      const cy = shape.geometry.y + shape.geometry.height / 2;
      const label = shape.metadata?.label || shape.slotNumber || '';
      const minDim = Math.min(shape.geometry.width, shape.geometry.height);
      const fontSize = Math.max(9, minDim * 0.3);
      // pick a contrasting text color based on slot status
      const status = shape.slotStatus || shape.status;
      const isOccupied = status === 'occupied' || shape.occupiedBy;
      const isExclusive = status === 'exclusive' || shape.assignedStudentId;
      const textColor = isOccupied ? '#be123c' : isExclusive ? '#1d4ed8' : '#15803d';
      return (
        <g
          key={id}
          transform={`rotate(${shape.geometry.rotation}, ${cx}, ${cy})`}
          onClick={() => handleSlotDetails(shape)}
          className='cursor-pointer'
        >
          <rect
            x={shape.geometry.x}
            y={shape.geometry.y}
            width={shape.geometry.width}
            height={shape.geometry.height}
            fill={fill}
            stroke={stroke}
            strokeWidth={strokeWidth}
            rx={3}
          />
          {label && (
            <text
              x={cx}
              y={cy}
              textAnchor='middle'
              dominantBaseline='middle'
              fontSize={fontSize}
              fontWeight='700'
              fontFamily='system-ui, sans-serif'
              fill={textColor}
              pointerEvents='none'
              style={{ userSelect: 'none' }}
            >
              {label}
            </text>
          )}
        </g>
      );
    } else if (shape.geometry.shape === 'polygon') {
      const pointsStr = shape.geometry.points.map((p) => `${p.x},${p.y}`).join(' ');
      const xs = shape.geometry.points.map((p) => p.x);
      const ys = shape.geometry.points.map((p) => p.y);
      const cx = (Math.min(...xs) + Math.max(...xs)) / 2;
      const cy = (Math.min(...ys) + Math.max(...ys)) / 2;
      const bboxW = Math.max(...xs) - Math.min(...xs);
      const bboxH = Math.max(...ys) - Math.min(...ys);
      const name = shape.metadata?.information?.name || shape.metadata?.label || '';
      const buildingFontSize = Math.max(10, Math.min(bboxW, bboxH) * 0.12);
      // pill background dimensions
      const pillPad = { x: 8, y: 4 };
      const pillW = buildingFontSize * name.length * 0.6 + pillPad.x * 2;
      const pillH = buildingFontSize + pillPad.y * 2;
      return (
        <g
          key={id}
          onClick={() => handleSlotDetails(shape)}
          className='cursor-pointer'
        >
          <polygon
            points={pointsStr}
            fill={fill}
            stroke={stroke}
            strokeWidth={strokeWidth}
          />
          {name && (
            <g pointerEvents='none'>
              <rect
                x={cx - pillW / 2}
                y={cy - pillH / 2}
                width={pillW}
                height={pillH}
                rx={pillH / 2}
                fill={dark ? 'rgba(30,30,30,0.75)' : 'rgba(255,255,255,0.82)'}
                stroke={dark ? '#4a4a4a' : '#d1d5db'}
                strokeWidth={0.8}
              />
              <text
                x={cx}
                y={cy}
                textAnchor='middle'
                dominantBaseline='middle'
                fontSize={buildingFontSize}
                fontWeight='700'
                fontFamily='system-ui, sans-serif'
                fill={dark ? '#e5e7eb' : '#1f2937'}
                style={{ userSelect: 'none' }}
              >
                {name}
              </text>
            </g>
          )}
        </g>
      );
    }
    return null;
  };

  if (!shapes) return <div>No shapes</div>;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      style={{ width: '100%', height: '100%', background: canvasBg, borderRadius: 12 }}
    >
      {shapes.map(renderShape)}
    </svg>
  );
}
