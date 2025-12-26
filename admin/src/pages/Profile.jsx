import { useSelector } from "react-redux";

const PencilIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M16.862 3.487a2.1 2.1 0 0 1 2.97 2.97L8.25 18.04l-4.5 1.125 1.125-4.5L16.862 3.487z"
    />
  </svg>
);
export default function Profile() {
  const { user } = useSelector((state) => state.auth.user);

  if (!user) {
    return <p className="p-5 text-gray-400 text-center">Loading profile...</p>;
  }

  return (
    <>
      {/* HEADER */}
      <header className="flex justify-between px-5 pt-5 items-center">
        <div className="flex flex-col">
          <h1 className="font-bold text-3xl text-gray-800">Account Details</h1>
          <p className="text-sm text-gray-400">
            Your organizational account details and activity status
          </p>
        </div>
      </header>

      {/*  CARD CONTAINER */}
      <div className="mx-5 mt-6 bg-white rounded-2xl shadow-sm border p-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-6">
          Personal Information
        </h2>
        {/* PROFILE SECTION */}
        <div className="flex items-center gap-8">
          {/* Profile Picture */}
          <div className="relative">
            <img
              src={
                user?.profileDetails?.url || "https://via.placeholder.com/150"
              }
              alt="Profile"
              className="w-50 h-50 rounded-full border-4 border-violet-500 object-cover"
            />

            {/* Online Status Indicator */}
            <span className="absolute bottom-2 right-2 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
          </div>

          {/* USER DETAILS */}
          <div className="flex-1 space-y-4">
            {/* UserName */}
            <div className="flex items-center gap-3 group">
              <label className="w-20 text-sm text-gray-500">Username</label>

              <div className="relative flex-1 max-w-md">
                <input
                  type="text"
                  value={user?.username || ""}
                  readOnly
                  className="w-full px-3 py-2 pr-8 rounded-md
                  bg-gray-50 border border-gray-200 text-gray-800
                  cursor-pointer group-hover:border-blue-400"
                />

                <span className="absolute right-3 top-1/2 -translate-y-1/2">
                  <PencilIcon />
                </span>
              </div>
            </div>

            {/* Name */}
            <div className="flex items-center gap-3 group">
              <label className="w-20 text-sm text-gray-500">Name</label>

              <div className="relative flex-1 max-w-md">
                <input
                  type="text"
                  value={user?.name || ""}
                  readOnly
                  className="w-full px-3 py-2 pr-8 rounded-md
                  bg-gray-50 border border-gray-200 text-gray-800
                  cursor-pointer group-hover:border-blue-400"
                />

                <span className="absolute right-3 top-1/2 -translate-y-1/2">
                  <PencilIcon />
                </span>
              </div>
            </div>

            {/* Role */}
            <div className="flex items-center gap-3 group">
              <label className="w-20 text-sm text-gray-500">Role</label>

              <div className="relative flex-1 max-w-md">
                <input
                  type="text"
                  value={user?.role || ""}
                  readOnly
                  className="w-full px-3 py-2 pr-8 rounded-md
                  bg-gray-50 border border-gray-200 text-gray-800
                  cursor-pointer group-hover:border-blue-400"
                />
              </div>
            </div>

            {/* Email */}
            <div className="flex items-center gap-3">
              <label className="w-20 text-sm text-gray-500">Email</label>

              <div className="relative flex-1 max-w-md">
                <input
                  type="text"
                  value={user?.email || ""}
                  readOnly
                  className="w-full px-3 py-2 rounded-md
                  bg-gray-50 border border-gray-200 text-gray-800"
                />
              </div>
            </div>
          </div>
        </div>{" "}
        {/* END USER DETAILS */}
        {/* DIVIDER */}
        <hr className="my-6 border-gray-200" />
        {/*  ACTION BUTTON  */}
        <button
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl
          bg-violet-600 text-white font-medium shadow
          hover:bg-violet-800 active:scale-95 transition"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
            />
          </svg>
          Change Photo
        </button>
      </div>
    </>
  );
}
