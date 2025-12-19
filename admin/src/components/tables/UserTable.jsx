export default function UserTable() {
  return (
    <tr className="grid grid-cols-[auto_repeat(4,minmax(0,1fr))_150px_100px] gap-5 px-5 py-4 items-center text-gray-400">
      {/* Checkbox */}
      <td>
        <div className="h-5 w-5 rounded-md border-gray-200 border-2 bg-white"></div>
      </td>
      {/* Profile & Name */}
      <td className="flex items-center gap-3">
        <img
          src="https://images.unsplash.com/photo-1499996860823-5214fcc65f8f?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGZhY2V8ZW58MHx8MHx8fDA%3D&fm=jpg&q=60&w=3000"
          alt=""
          className="h-10 w-10 object-cover rounded-full"
        />
        <div className="flex flex-col overflow-hidden flex-1">
          <h2 className="font-medium text-sm text-gray-700 text-nowrap overflow-hidden">
            Clarence Gomez
          </h2>
          <p className="text-xs">Student</p>
        </div>
      </td>
      {/* Contact */}
      <td className="overflow-hidden *:overflow-hidden *:text-nowrap">
        <p>example123@gmail.com</p>
        <p>+63 912-123-9814</p>
      </td>
      {/* Last Login & Created At */}
      <td>05-23-25 10:03 AM</td>
      <td>03-21-25 8:25 AM</td>
      {/* Status */}
      <td className="flex items-start">
        <div className="text-green-500 border-green-500 border rounded-xl py-2 px-4 bg-green-100">
          Active
        </div>
      </td>
      {/* Action Button */}
      <td className="flex items-center gap-2">
        {/* View */}
        <button className="duration-75 p-2 rounded-xl hover:bg-violet-100 border border-transparent hover:border-violet-500 hover:text-violet-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15"
            />
          </svg>
        </button>
        {/* Delete */}
        <button className="p-2 rounded-xl hover:bg-red-100 hover:border-red-500 border-transparent duration-75 border flex items-center justify-center hover:text-red-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
            />
          </svg>
        </button>
      </td>
    </tr>
  );
}
