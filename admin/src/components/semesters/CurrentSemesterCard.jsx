import { useState } from 'react';
import { Edit2, X } from 'lucide-react';
import useDark from '../../hooks/useDark';

export default function CurrentSemesterCard({ semester, onUpdateName, isLoading }) {
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(semester?.name || '');
  const { dark, bg, card, border, input } = useDark();

  const handleSave = async () => {
    if (newName.trim() && newName !== semester.name) {
      await onUpdateName(semester._id, newName);
      setIsEditing(false);
    }
  };

  const formatDate = (d) => new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

  const getDaysRemaining = (endDate) => {
    const diff = new Date(endDate) - new Date();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  if (!semester) {
    return (
      <div className={`p-5 rounded-lg ${card} border ${border}`}>
        <p className="text-gray-500 text-sm">No active semester</p>
      </div>
    );
  }

  const daysRemaining = getDaysRemaining(semester.endDate);

  return (
    <div className={`p-5 rounded-lg ${bg} border ${border} shadow-sm`}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-wide">Current Semester</p>
          {!isEditing ? (
            <h2 className={`text-xl font-bold mt-1 ${dark ? 'text-gray-100' : 'text-gray-800'}`}>{semester.name}</h2>
          ) : (
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              autoFocus
              className={`text-xl font-bold mt-1 border rounded px-2 py-1 outline-none focus:ring-2 focus:ring-violet-400 ${input}`}
            />
          )}
        </div>
        {!isEditing ? (
          <button onClick={() => setIsEditing(true)} className="text-gray-400 hover:text-violet-500 transition-colors">
            <Edit2 size={18} />
          </button>
        ) : (
          <div className="flex gap-2">
            <button onClick={handleSave} disabled={isLoading} className="bg-violet-500 text-white px-3 py-1 rounded text-sm hover:bg-violet-600 disabled:opacity-50">Save</button>
            <button onClick={() => { setIsEditing(false); setNewName(semester.name); }} className="text-gray-400 hover:text-red-500"><X size={18} /></button>
          </div>
        )}
      </div>
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Start Date', value: formatDate(semester.startDate) },
          { label: 'End Date', value: formatDate(semester.endDate) },
          {
            label: 'Days Remaining',
            value: `${daysRemaining} days`,
            color: daysRemaining > 7 ? 'text-green-600' : daysRemaining > 0 ? 'text-yellow-600' : 'text-red-600',
          },
          { label: 'Slot Price', value: `₱${semester.slotPrice.toLocaleString()}` },
        ].map(({ label, value, color }) => (
          <div key={label}>
            <p className="text-xs text-gray-400">{label}</p>
            <p className={`text-sm font-medium mt-1 ${color || (dark ? 'text-gray-200' : 'text-gray-700')}`}>{value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
