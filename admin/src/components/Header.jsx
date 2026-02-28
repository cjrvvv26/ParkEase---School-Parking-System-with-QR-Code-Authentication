import { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { logout } from "../features/authSlice";
import useFetch from "../hooks/useFetch";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const [showSettings, setShowSettings] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const { error, setError, fetchData } = useFetch();
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const floatFeatures = [
    {
      path: "/settings",
      label: "Settings",
      icon: (
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
            d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
          />
        </svg>
      ),
    },
    // {
    //   label: "Help and Support",
    //   icon: (
    //     <svg
    //       xmlns="http://www.w3.org/2000/svg"
    //       fill="none"
    //       viewBox="0 0 24 24"
    //       strokeWidth={1.5}
    //       stroke="currentColor"
    //       className="size-6"
    //     >
    //       <path
    //         strokeLinecap="round"
    //         strokeLinejoin="round"
    //         d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z"
    //       />
    //     </svg>
    //   ),
    // },
    {
      label: "Sign out",
      icon: (
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
            d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15"
          />
        </svg>
      ),
      action: async () => {
        try {
          await fetchData("/super-admin/sign-out", {
            method: "DELETE",
          });
          dispatch(logout());
          navigate("/sign-in");
        } catch (error) {
          setError(error.response.data.error);
        }
      },
    },
  ];

  const handleShowSettings = () => {
    setShowSettings(!showSettings);
    console.log(showSettings);
  };

  return (
    <div className="h-[80px] bg-white rounded-xl text-gray-700 flex items-center justify-between px-4">
      <div
        type="text"
        className="flex gap-2 rounded-full bg-gray-100 h-[50px] w-[400px] items-center justify-center"
      >
        <div className="flex ml-2 items-center justify-center rounded-full bg-white h-9 w-9">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-5 text-gray-400"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
            />
          </svg>
        </div>
        <input
          type="text"
          placeholder="Search"
          className="flex-1 h-full outline-none"
        />
        <div className="flex text-xs text-gray-400 mr-2 items-center justify-center gap-1 px-2 bg-white rounded-xl h-9">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-3.5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z"
            />
          </svg>
          +<p>F</p>
        </div>
      </div>

      {/* Right Header Section */}
      <div className="flex items-center gap-3">
        {/* Header Icons */}
        <div className="flex gap-3 duration-75">
          <div className="relative">
            {/* Notification bar */}
            <button
              onClick={() => setShowNotification(!showNotification)}
              className="relative flex items-center justify-center hover:bg-gray-100 rounded-xl box-border p-2 h-12 w-12 cursor-pointer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6 text-gray-400"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
                />
              </svg>
              <div className="h-1 w-1 rounded-full bg-rose-400 absolute left-7 bottom-8"></div>
            </button>
            {/* Float Notification Dialog */}
            {showNotification && (
              <div className="rounded-xl bg-white absolute w-[350px] top-14 left-1/2 -translate-x-1/2 border border-gray-200 flex flex-col pb-3 z-10">
                <h2 className="font-medium text-base pt-5 px-5 pb-3">
                  Notifications
                </h2>
                {/* Notification List */}
                {Array.from({ length: 5 }, (_, i) => (
                  <div
                    key={i}
                    className="flex gap-3 mx-3 p-2 rounded-xl hover:bg-gray-100 relative"
                  >
                    <img
                      src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8cGVyc29ufGVufDB8fDB8fHww&fm=jpg&q=60&w=3000"
                      alt=""
                      className="h-10 min-w-10 rounded-full object-cover"
                    />
                    <div className="flex gap-1 flex-col overflow-hidden">
                      <h2 className="font-medium text-sm">Jamie Gomez</h2>
                      <p className="truncate text-gray-400">
                        Successfully paid of 100 pesos.
                      </p>
                      <p className="truncate text-gray-400 text-xs">1hr ago</p>
                    </div>
                    {/* If still not read */}
                    <span className="h-3 absolute top-1/2 right-3 -translate-y-1/2 w-3 rounded-full bg-violet-500"></span>
                  </div>
                ))}
                <Link to="/notifications" className="p-2 font-medium text-white bg-violet-500 rounded-xl mx-5 mt-3 mb-2 hover:bg-violet-400">
                  See All
                </Link>
              </div>
            )}
          </div>
        </div>
        {/* User Profile */}
        <div
          onClick={handleShowSettings}
          className="flex gap-2 relative select-none items-center hover:bg-gray-100 duration-75 cursor-pointer p-2 rounded-xl"
        >
          {/* Basic Info */}
          {user.profileDetails?.url ? (
            <img
              src={user.profileDetails.url}
              alt=""
              className="h-10 w-10 object-cover rounded-full"
            />
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="size-10 text-gray-400"
            >
              <path
                fillRule="evenodd"
                d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
                clipRule="evenodd"
              />
            </svg>
          )}
          <div className="flex flex-col">
            <h2 className="text-nowrap font-medium">{user.name}</h2>
            <p className="text-gray-400 text-xs">{user.username}</p>
          </div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className={`${
              showSettings ? "rotate-180" : "rotate-0"
            } size-6 text-gray-400 ml-2 duration-100`}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m19.5 8.25-7.5 7.5-7.5-7.5"
            />
          </svg>

          {/* Additional Navigation */}
          {showSettings && (
            <div className="border absolute top-15 w-[300px] right-0 overflow-hidden border-gray-200 rounded-lg bg-white flex flex-col z-10">
              <div className="flex gap-3 px-2 py-4 items-center">
                {/* <img
                  src={Me}
                  alt=""
                  className="h-12 w-12 object-cover rounded-full"
                /> */}
                {user?.profileDetails.url ? (
                  <img
                    src={user?.profileDetails.url}
                    alt=""
                    className="h-12 w-12 rounded-full object-cover"
                  />
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="size-12 text-gray-400"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
                <div className="flex flex-col ">
                  <h2 className="text-sm font-medium">{user.name}</h2>
                  <Link
                    to="/account-details"
                    className="text-xs hover:text-violet-500 hover:underline text-gray-400"
                  >
                    Account details
                  </Link>
                </div>
              </div>

              <div className="border-t border-gray-200">
                {floatFeatures.map((feature, index) => (
                  <Link
                    to={feature.path}
                    onClick={async () => {
                      if (feature.action) await feature.action();
                    }}
                    key={index}
                    className="flex items-center gap-3 py-4 px-4 hover:bg-violet-500 hover:text-white"
                  >
                    {feature.icon}
                    <p>{feature.label}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
