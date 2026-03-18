import { CircleUserRound, MoveRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import useDark from '../../hooks/useDark';

export default function UserTable({ users = [] }) {
  const { dark, hover, text } = useDark();

  if (!Array.isArray(users) || users.length === 0) {
    return (
      <tbody className="text-center flex items-center justify-center py-20 text-gray-400">
        No users
      </tbody>
    );
  }

  return users.map((user) => (
    <tr
      key={user._id}
      className={`grid grid-cols-[250px_repeat(2,minmax(0,1fr))_150px_100px] gap-5 px-5 py-4 items-center ${dark ? 'text-gray-400 hover:bg-[#2f2f2f]' : 'text-gray-400 hover:bg-gray-50'}`}
    >
      <td className="flex items-center gap-3">
        {user?.profileDetails?.url ? (
          <img src={user.profileDetails?.url} alt="" className="h-10 w-10 object-cover rounded-full" />
        ) : (
          <CircleUserRound strokeWidth={1.5} size={40} />
        )}
        <div className="flex flex-col overflow-hidden flex-1">
          <h2 className={`font-medium text-sm text-nowrap overflow-hidden ${dark ? 'text-gray-200' : 'text-gray-700'}`}>
            {user.name?.firstName + ' ' + user.name?.lastName}
          </h2>
          <p className="text-xs">{user.role.charAt(0).toUpperCase() + user.role.slice(1)}</p>
        </div>
      </td>
      <td className="overflow-hidden *:overflow-hidden *:text-nowrap">
        <p>{user.email}</p>
        <p>{user?.phoneNo}</p>
      </td>
      <td>{user?.lastActive || 'No record'}</td>
      <td className="flex items-start">
        <div className={`${user.status === 'active' ? 'text-green-500 bg-green-100 border-green-500' : 'text-rose-500 bg-rose-100 border-rose-500'} border rounded-xl py-2 px-4`}>
          {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
        </div>
      </td>
      <td className="flex items-center gap-2">
        <Link
          to={`/users/${user._id}`}
          className={`duration-75 p-2 rounded-xl border border-transparent hover:border-violet-500 hover:text-violet-500 ${dark ? 'hover:bg-violet-500/10' : 'hover:bg-violet-100'}`}
        >
          <MoveRight strokeWidth={1.5} />
        </Link>
      </td>
    </tr>
  ));
}
