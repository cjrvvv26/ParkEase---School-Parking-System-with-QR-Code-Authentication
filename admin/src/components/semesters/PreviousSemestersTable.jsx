import { Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useDark from '../../hooks/useDark';

export default function PreviousSemestersTable({ semesters, isLoading }) {
  const navigate = useNavigate();
  const { dark, border, card } = useDark();

  const formatDate = (d) => new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-2">
        <div className={`h-10 rounded ${dark ? 'bg-[#3a3a3a]' : 'bg-gray-200'}`}></div>
        <div className={`h-12 rounded ${dark ? 'bg-[#3a3a3a]' : 'bg-gray-200'}`}></div>
        <div className={`h-12 rounded ${dark ? 'bg-[#3a3a3a]' : 'bg-gray-200'}`}></div>
      </div>
    );
  }

  if (!semesters || semesters.length === 0) {
    return <div className="text-center py-8"><p className="text-gray-400">No previous semesters yet</p></div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className={`border-b ${border} ${dark ? 'bg-[#2f2f2f]' : 'bg-gray-50'}`}>
            {['Semester Name', 'Start Date', 'End Date', 'Slot Price', 'Revenue', 'Action'].map((h) => (
              <th key={h} className="px-5 py-3 text-left">
                <p className="text-xs font-semibold text-gray-500 uppercase">{h}</p>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {semesters.map((semester) => (
            <tr key={semester._id} className={`border-b ${border} ${dark ? 'hover:bg-[#2f2f2f]' : 'hover:bg-gray-50'} transition-colors`}>
              <td className="px-5 py-3"><p className={`text-sm font-medium ${dark ? 'text-gray-200' : 'text-gray-800'}`}>{semester.name}</p></td>
              <td className="px-5 py-3"><p className={`text-sm ${dark ? 'text-gray-400' : 'text-gray-600'}`}>{formatDate(semester.startDate)}</p></td>
              <td className="px-5 py-3"><p className={`text-sm ${dark ? 'text-gray-400' : 'text-gray-600'}`}>{formatDate(semester.endDate)}</p></td>
              <td className="px-5 py-3"><p className={`text-sm ${dark ? 'text-gray-400' : 'text-gray-600'}`}>₱{semester.slotPrice.toLocaleString()}</p></td>
              <td className="px-5 py-3"><p className={`text-sm font-medium ${dark ? 'text-gray-200' : 'text-gray-800'}`}>₱{(semester.revenue || 0).toLocaleString()}</p></td>
              <td className="px-5 py-3">
                <div className="flex justify-center">
                  <button onClick={() => navigate(`/semesters/${semester._id}`, { state: { semester } })} className="text-blue-500 hover:text-blue-700 transition-colors p-1">
                    <Eye size={18} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
