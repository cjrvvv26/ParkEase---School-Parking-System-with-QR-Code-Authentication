import React, { useState } from 'react';
import useFetch from '../../hooks/useFetch';
import useDark from '../../hooks/useDark';

const SLOT_COLORS = {
  exclusive: { light: '#fef3c7', dark: '#78350f' },
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
    onShapeClick({ ...shape });
  };

  const renderShape = (shape) => {
    const fill = getSlotFill(shape, dark);
    const id = shape._id || shape.tempId;
    const isSelected = selectedId === id;
    const stroke = isSelected ? '#8e51ff' : dark ? '#4a4a4a' : '#d1d5dc';
    const strokeWidth = isSelected ? '2' : '1';

    if (shape.geometry.shape === 'rect') {
      return (
        <rect
          key={id}
          x={shape.geometry.x}
          y={shape.geometry.y}
          width={shape.geometry.width}
          height={shape.geometry.height}
          transform={`rotate(${shape.geometry.rotation}, ${shape.geometry.x + shape.geometry.width / 2}, ${shape.geometry.y + shape.geometry.height / 2})`}
          fill={fill}
          stroke={stroke}
          strokeWidth={strokeWidth}
          onClick={() => handleSlotDetails(shape)}
          className='cursor-pointer'
        />
      );
    } else if (shape.geometry.shape === 'polygon') {
      const pointsStr = shape.geometry.points.map((p) => `${p.x},${p.y}`).join(' ');
      return (
        <polygon
          key={id}
          points={pointsStr}
          fill={fill}
          stroke={stroke}
          strokeWidth={strokeWidth}
          onClick={() => handleSlotDetails(shape)}
          className='cursor-pointer'
        />
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
