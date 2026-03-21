import { useRef, useState } from 'react';
import { Tag, Layers, Ruler, RotateCw, Trash2, ImagePlus, AlignLeft, Building2, SquareDashed } from 'lucide-react';
import axiosConfig from '../../utils/axiosConfig';
import useDark from '../../hooks/useDark';

function Field({ icon: Icon, label, children }) {
  return (
    <div className='flex flex-col gap-1.5'>
      <div className='flex items-center gap-1.5 text-gray-400'>
        <Icon size={12} strokeWidth={1.8} />
        <span className='text-[11px] uppercase tracking-wide font-medium'>{label}</span>
      </div>
      {children}
    </div>
  );
}

function StyledInput({ value, onChange, type = 'text', suffix, dark }) {
  return (
    <div className='flex items-center gap-1'>
      <input
        type={type}
        value={value}
        onChange={onChange}
        className={`flex-1 border text-xs rounded-lg px-2.5 py-1.5 outline-none focus:border-violet-400 focus:ring-1 focus:ring-violet-400/20 transition ${dark ? 'bg-[#3a3a3a] border-[#4a4a4a] text-gray-200 placeholder-gray-500' : 'bg-gray-50 border-gray-200 text-gray-700'}`}
      />
      {suffix && <span className='text-gray-400 text-[11px]'>{suffix}</span>}
    </div>
  );
}

export default function PropertiesPanel({ selectedShape, onUpdateShape, onDeleteShape }) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const fileRef = useRef();
  const { dark } = useDark();

  const handleDelete = async () => {
    if (selectedShape._id) {
      try { await axiosConfig.delete(`/map/shape/${selectedShape._id}`); } catch (e) { console.error(e); }
    }
    onDeleteShape(selectedShape.tempId || selectedShape._id);
    setConfirmDelete(false);
  };

  const isSlot = selectedShape?.metadata?.type === 'slot';
  const isBuilding = selectedShape?.metadata?.type === 'building';
  const isRect = selectedShape?.geometry?.shape === 'rect';

  const panelCls = `w-72 h-[calc(100vh-94.4px)] border-l flex flex-col overflow-y-auto ${dark ? 'bg-[#242424] border-[#3a3a3a]' : 'bg-white border-gray-100'}`;
  const sectionBorder = dark ? 'border-[#3a3a3a]' : 'border-gray-100';
  const headingText = dark ? 'text-gray-200' : 'text-gray-700';
  const mutedText = dark ? 'text-gray-500' : 'text-gray-300';
  const typeBoxCls = `flex items-center gap-2 px-2.5 py-1.5 border rounded-lg ${dark ? 'bg-[#3a3a3a] border-[#4a4a4a] text-gray-300' : 'bg-gray-50 border-gray-200 text-gray-600'}`;

  return (
    <aside className={panelCls}>
      {/* Header */}
      <div className={`px-4 py-3 border-b ${sectionBorder} flex items-center justify-between`}>
        <span className={`text-xs font-semibold tracking-wide uppercase ${headingText}`}>Properties</span>
        {selectedShape && (
          <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${isSlot ? 'bg-violet-50 text-violet-600 border border-violet-200' : 'bg-emerald-50 text-emerald-600 border border-emerald-200'}`}>
            {isSlot ? 'Slot' : 'Building'}
          </span>
        )}
      </div>

      {!selectedShape ? (
        <div className='flex-1 flex flex-col items-center justify-center gap-3 px-6'>
          <SquareDashed size={36} strokeWidth={1} className='text-gray-400' />
          <p className='text-xs text-center text-gray-400'>Click a shape on the canvas to edit its properties</p>
        </div>
      ) : (
        <div className='flex flex-col gap-0 flex-1'>
          {/* Metadata */}
          <div className={`px-4 py-4 flex flex-col gap-4 border-b ${sectionBorder}`}>
            <p className={`text-[10px] uppercase tracking-widest font-semibold ${mutedText}`}>Metadata</p>

            {isSlot && (
              <Field icon={Tag} label='Label'>
                <StyledInput dark={dark} value={selectedShape.metadata?.label || ''} onChange={(e) => onUpdateShape({ ...selectedShape, metadata: { ...selectedShape.metadata, label: e.target.value } })} />
              </Field>
            )}

            {isBuilding && (
              <>
                <Field icon={Building2} label='Name'>
                  <StyledInput dark={dark} value={selectedShape.metadata?.information?.name || ''} onChange={(e) => onUpdateShape({ ...selectedShape, metadata: { ...selectedShape.metadata, information: { ...selectedShape.metadata.information, name: e.target.value } } })} />
                </Field>
                <Field icon={AlignLeft} label='Description'>
                  <textarea
                    value={selectedShape.metadata?.information?.description || ''}
                    onChange={(e) => onUpdateShape({ ...selectedShape, metadata: { ...selectedShape.metadata, information: { ...selectedShape.metadata.information, description: e.target.value } } })}
                    rows={3}
                    className={`w-full border text-xs rounded-lg px-2.5 py-1.5 outline-none focus:border-violet-400 focus:ring-1 focus:ring-violet-400/20 transition resize-none ${dark ? 'bg-[#3a3a3a] border-[#4a4a4a] text-gray-200 placeholder-gray-500' : 'bg-gray-50 border-gray-200 text-gray-700'}`}
                  />
                </Field>
                <Field icon={ImagePlus} label='Picture'>
                  <div onClick={() => fileRef.current?.click()} className={`relative w-full h-28 rounded-xl border-2 border-dashed hover:border-violet-400 transition cursor-pointer overflow-hidden flex items-center justify-center group ${dark ? 'border-[#4a4a4a] bg-[#3a3a3a]' : 'border-gray-200 bg-gray-50 hover:bg-violet-50/30'}`}>
                    {selectedShape.metadata?.information?.picture?.url ? (
                      <>
                        <img src={selectedShape.metadata.information.picture.url} alt='Building' className='w-full h-full object-cover' />
                        <div className='absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center'>
                          <ImagePlus size={20} className='text-white' />
                        </div>
                      </>
                    ) : (
                      <div className='flex flex-col items-center gap-1.5 text-gray-400 group-hover:text-violet-400 transition'>
                        <ImagePlus size={22} strokeWidth={1.5} />
                        <span className='text-[11px]'>Click to upload</span>
                      </div>
                    )}
                    <input ref={fileRef} type='file' accept='image/*' className='hidden' onChange={(e) => {
                      const file = e.target.files[0];
                      if (!file) return;
                      onUpdateShape({ ...selectedShape, imageFile: file, metadata: { ...selectedShape.metadata, information: { ...selectedShape.metadata.information, picture: { url: URL.createObjectURL(file), public_id: null } } } });
                    }} />
                  </div>
                </Field>
              </>
            )}

            <Field icon={Layers} label='Type'>
              <div className={typeBoxCls}>
                {isSlot ? <SquareDashed size={12} className='text-violet-500' /> : <Building2 size={12} className='text-emerald-500' />}
                <span className='text-xs capitalize'>{selectedShape.metadata?.type}</span>
              </div>
            </Field>
          </div>

          {/* Geometry */}
          {isRect && (
            <div className={`px-4 py-4 flex flex-col gap-4 border-b ${sectionBorder}`}>
              <p className={`text-[10px] uppercase tracking-widest font-semibold ${mutedText}`}>Geometry</p>
              <div className='grid grid-cols-2 gap-3'>
                <Field icon={Ruler} label='Height'>
                  <StyledInput dark={dark} type='number' value={selectedShape.geometry?.height || ''} suffix='px' onChange={(e) => onUpdateShape({ ...selectedShape, geometry: { ...selectedShape.geometry, height: parseFloat(e.target.value) || 0 } })} />
                </Field>
                <Field icon={Ruler} label='Width'>
                  <StyledInput dark={dark} type='number' value={selectedShape.geometry?.width || ''} suffix='px' onChange={(e) => onUpdateShape({ ...selectedShape, geometry: { ...selectedShape.geometry, width: parseFloat(e.target.value) || 0 } })} />
                </Field>
              </div>
              <Field icon={RotateCw} label='Rotation'>
                <div className='flex items-center gap-2'>
                  <input type='range' min={0} max={360} value={selectedShape.geometry?.rotation || 0} onChange={(e) => onUpdateShape({ ...selectedShape, geometry: { ...selectedShape.geometry, rotation: parseFloat(e.target.value) || 0 } })} className='flex-1 accent-violet-500' />
                  <span className={`text-xs w-10 text-right ${dark ? 'text-gray-400' : 'text-gray-500'}`}>{selectedShape.geometry?.rotation || 0}°</span>
                </div>
              </Field>
            </div>
          )}

          {/* Danger zone */}
          <div className='px-4 py-4 mt-auto'>
            {!confirmDelete ? (
              <button onClick={() => setConfirmDelete(true)} className='w-full flex items-center justify-center gap-2 py-2 rounded-xl border border-rose-200 text-rose-500 text-xs hover:bg-rose-50 transition'>
                <Trash2 size={13} strokeWidth={1.8} /> Delete Shape
              </button>
            ) : (
              <div className='flex flex-col gap-2 p-3 rounded-xl bg-rose-50 border border-rose-200'>
                <p className='text-xs text-rose-600 text-center'>Delete this shape?</p>
                <div className='flex gap-2'>
                  <button onClick={() => setConfirmDelete(false)} className={`flex-1 py-1.5 rounded-lg border text-xs transition ${dark ? 'border-[#4a4a4a] bg-[#3a3a3a] text-gray-300 hover:bg-[#4a4a4a]' : 'border-gray-200 bg-white text-gray-500 hover:bg-gray-50'}`}>Cancel</button>
                  <button onClick={handleDelete} className='flex-1 py-1.5 rounded-lg bg-rose-500 hover:bg-rose-600 text-xs text-white transition'>Delete</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </aside>
  );
}
