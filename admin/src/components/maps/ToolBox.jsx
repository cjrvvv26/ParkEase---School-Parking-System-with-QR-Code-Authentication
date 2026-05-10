import IconButton from './IconButton';
import { useSelector } from 'react-redux';

export default function ToolBox({
  setShapes,
  mapName = 'default',
  setIsDrawing,
  isDrawing,
  points,
  setPoints,
  setClickedShapeId,
  setMode,
  setErrorMessage,
  mode,
}) {
  const { theme } = useSelector((s) => s.auth);
  const dark = theme === 'dark';

  const addSlot = () => {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 5).toUpperCase();
    setShapes((prev) => [
      ...prev,
      {
        tempId: crypto.randomUUID(),
        geometry: {
          shape: 'rect',
          x: 50,
          y: 50,
          width: 100,
          height: 50,
          rotation: 0,
        },
        metadata: {
          label: `${timestamp}-${random}`,
          type: 'slot',
          area: mapName,
        },
      },
    ]);
    setIsDrawing(false);
    setPoints([]);
  };

  const handleFinishPolygon = () => {
    if (!isDrawing) return;
    if (points.length < 3) {
      setErrorMessage('Polygon requires at least 3 points.');
      return;
    }
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 5).toUpperCase();
    setShapes((prev) => [
      ...prev,
      {
        tempId: crypto.randomUUID(),
        geometry: { shape: 'polygon', rotation: '0', points },
        metadata: {
          label: `${timestamp}-${random}`,
          type: 'building',
          area: mapName,
          information: { name: '', description: '' },
        },
      },
    ]);
    setIsDrawing(false);
    setPoints([]);
    setErrorMessage('');
    setMode('select');
  };

  const handleFinishArrow = () => {
    if (!isDrawing) return;
    if (points.length < 2) {
      setErrorMessage('Arrow requires at least 2 points.');
      return;
    }
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 5).toUpperCase();
    setShapes((prev) => [
      ...prev,
      {
        tempId: crypto.randomUUID(),
        geometry: { shape: 'arrow', points },
        metadata: {
          label: `${timestamp}-${random}`,
          type: 'arrow',
          area: mapName,
        },
      },
    ]);
    setIsDrawing(false);
    setPoints([]);
    setErrorMessage('');
    setMode('select');
  };

  const addText = () => {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 5).toUpperCase();
    setShapes((prev) => [
      ...prev,
      {
        tempId: crypto.randomUUID(),
        geometry: { shape: 'text', x: 100, y: 100, width: 200, height: 50 },
        metadata: {
          label: `${timestamp}-${random}`,
          type: 'text',
          area: mapName,
          textContent: 'Text Label',
          fontSize: 16,
          fontColor: '#000000',
        },
      },
    ]);
    setIsDrawing(false);
    setPoints([]);
  };

  return (
    <div
      className={`absolute bottom-3 p-2 border rounded-md shadow-md -translate-x-1/2 left-1/2 flex gap-2 items-center ${dark ? 'bg-[#2f2f2f] border-[#3a3a3a] text-gray-200' : 'bg-white border-gray-200 text-gray-700'}`}
    >
      <IconButton
        name='MousePointer2'
        size={5}
        label='Select'
        action={() => {
          setMode('select');
          if (isDrawing) {
            setIsDrawing(false);
            setPoints([]);
          } else {
            setClickedShapeId(null);
          }
        }}
      />
      <IconButton name='SquareDashed' size={5} label='Slot' action={addSlot} />
      <IconButton
        name='Building'
        size={5}
        label='Building'
        action={() => {
          if (isDrawing && mode === 'draw') {
            handleFinishPolygon();
          } else {
            setMode('draw');
            setIsDrawing(true);
          }
        }}
      />
      <IconButton
        name='ArrowRight'
        size={5}
        label='Arrow'
        action={() => {
          if (isDrawing && mode === 'arrow') {
            handleFinishArrow();
          } else {
            setMode('arrow');
            setIsDrawing(true);
          }
        }}
      />
      <IconButton name='Type' size={5} label='Text' action={addText} />
    </div>
  );
}
