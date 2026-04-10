import { SquareDashedBottom, TrendingUp, BookOpenCheck, Banknote, Landmark, Users, ShieldUser, SquaresExclude, Clock, CreditCard } from 'lucide-react';
import useDark from '../../hooks/useDark';

export default function ReportSummaryCard({ reports = [], loading, stats }) {
  const { dark, card, cardInner } = useDark();

  const renderIcon = (title) => {
    switch (title) {
      case 'Total Revenue': return <Landmark size={30} />;
      case 'Total Active Users': return <Users size={30} />;
      case 'Total Paid Students': return <CreditCard size={30} />;
      case 'Avg Parking (mins)': return <Clock size={30} />;
      case 'Total Semesters': return <BookOpenCheck size={30} />;
      case 'Average Revenue': return <Banknote size={30} />;
      case 'Highest Earning': return <TrendingUp size={30} />;
      case 'Total Slots': return <SquareDashedBottom size={30} />;
      case 'Total Exclusive': return <ShieldUser size={30} />;
      case 'Total Available': return <Users size={30} />;
      case 'Total Occupied': return <SquaresExclude size={30} />;
      default: return null;
    }
  };

  const formatData = (item) => {
    if (item.title === 'Total Revenue' || item.title === 'Average Revenue') {
      return `₱${item.data.toLocaleString()}`;
    }
    return item.data;
  };

  const displayData = stats ? stats.map((item) => ({ ...item, data: formatData(item) })) : reports;

  if (loading) {
    return Array.from({ length: 4 }, (_, i) => (
      <div key={i} className={`h-full w-full animate-pulse ${card} rounded-xl p-5 flex gap-3`}>
        <div className="flex items-center justify-between w-full">
          <div className="flex flex-col justify-center h-full gap-1">
            <div className={`w-32 h-3 rounded-md ${dark ? 'bg-[#3a3a3a]' : 'bg-gray-200'}`}></div>
            <div className={`w-24 mt-2 h-3 rounded-md ${dark ? 'bg-[#3a3a3a]' : 'bg-gray-200'}`}></div>
          </div>
          <div className={`rounded-xl h-20 w-20 ${dark ? 'bg-[#3a3a3a]' : 'bg-gray-200'}`}></div>
        </div>
      </div>
    ));
  }

  return displayData.map((item, index) => (
    <div key={index} className={`h-full w-full ${card} rounded-xl p-5 flex gap-3`}>
      <div className="flex items-center justify-between w-full">
        <div className="flex flex-col justify-center h-full gap-1">
          <h1 className="text-4xl font-semibold">{item.data}</h1>
          <p className="font-medium text-base">{item.title}</p>
          <p className="text-gray-400 text-xs">All semesters</p>
        </div>
        <div className="flex items-center justify-center rounded-xl p-2 h-20 w-20 bg-blue-500 text-white">
          {renderIcon(item.title)}
        </div>
      </div>
    </div>
  ));
}
