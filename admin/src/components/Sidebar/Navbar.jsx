import { useState } from "react";
import navData from "./NavData";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import Logo from '../../assets/images/new-logo.png';

export default function Navbar({ show, toggleShow }) {
  const [showFloat, setShowFloat] = useState(false);
  const { main, management } = navData();
  const location = useLocation();
  const { theme } = useSelector((s) => s.auth);
  const dark = theme === "dark";

  return (
    <div
      onMouseEnter={() => setTimeout(() => setShowFloat(true), 1000)}
      onMouseLeave={() => setTimeout(() => setShowFloat(false), 1000)}
      className={`${show ? "w-[250px]" : "w-[80px]"} relative z-50 duration-100 rounded-xl h-[calc(100vh-16px)] ${
        dark ? "bg-[#242424] text-gray-200" : "bg-white text-gray-700"
      }`}
    >
      {showFloat && (
        <button
          onClick={() => toggleShow(!show)}
          className={`border absolute rounded-xl p-2 top-1/2 -translate-y-1/2 -right-4 z-10 flex items-center justify-center ${
            dark ? "bg-[#242424] border-[#3a3a3a]" : "bg-white border-gray-200"
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"
            className={`${show ? "rotate-0" : "rotate-180"} size-4 duration-100`}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
          </svg>
        </button>
      )}

      <div className="flex items-center justify-center h-[80px]">
        {show ? (
          <div className="flex gap-2 items-center">
            <img src={Logo} alt='Logo' className='h-10 w-10 object-contain' />
            <h1 className="text-violet-500 text-sm font-bold leading-tight">School Parking<br />System</h1>
          </div>
        ) : (
          <img src={Logo} alt='Logo' className='h-10 w-10 object-contain' />
        )}
      </div>

      <div className={`flex flex-col ${show ? "" : "items-center"}`}>
        <p className={`${show ? "ml-4" : ""} text-xs ${dark ? "text-gray-500" : "text-gray-400"}`}>Main</p>
        {main.map((feature, index) => (
          <Link
            to={feature.path}
            key={index}
            className={`${show ? "gap-3" : ""} flex items-center p-4 mx-2 rounded-xl ${
              location.pathname === feature.path
                ? "bg-violet-500 text-white"
                : dark ? "hover:bg-[#2f2f2f] text-gray-300" : "hover:bg-gray-100 text-gray-700"
            }`}
          >
            {feature.icon}
            {show && <p>{feature.label}</p>}
          </Link>
        ))}
        <p className={`${show ? "ml-4" : ""} text-xs mt-2 ${dark ? "text-gray-500" : "text-gray-400"}`}>Management</p>
        {management.map((feature, index) => (
          <Link
            to={feature.path}
            key={index}
            className={`${show ? "gap-3" : ""} flex items-center p-4 mx-2 rounded-xl ${
              location.pathname === feature.path
                ? "bg-violet-500 text-white"
                : dark ? "hover:bg-[#2f2f2f] text-gray-300" : "hover:bg-gray-100 text-gray-700"
            }`}
          >
            {feature.icon}
            {show && <p>{feature.label}</p>}
          </Link>
        ))}
      </div>
    </div>
  );
}
