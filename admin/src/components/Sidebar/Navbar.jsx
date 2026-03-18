import { useState } from "react";
import navData from "./NavData";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const LogoSVG = () => (
  <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
    viewBox="0 0 612 792" className="h-10 w-10">
    <g><g>
      <path fill="#8E51FF" d="M9.9,106.6c0,28.4,23,51.4,51.4,51.4h314.3c4.3,0,8.6,0.5,12.7,1.6c25.6,6.5,109.8,36.2,109.8,144
        c0,107.9-75.1,133.4-97.8,138.6c-3.7,0.9-7.4,1.2-11.2,1.2H61.3c-28.4,0-51.4,23-51.4,51.4s23,51.4,51.4,51.4h334.7
        c4.7,0,9.3-0.6,13.9-1.9c33.6-9.6,171.4-59.5,192-236.4c0.4-3.2,0.4-6.3,0.2-9.5c-2.2-31.6-22-199.2-193.4-241.8
        c-4-1-8.3-1.5-12.4-1.5H61.3C32.9,55.2,9.9,78.2,9.9,106.6z"/>
      <path fill="#8E51FF" d="M9.9,293.6c0,27.2,22.1,49.3,49.3,49.3h246.2c27.2,0,49.3-22.1,49.3-49.3
        c0-27.2-22.1-49.3-49.3-49.3H59.1C31.9,244.4,9.9,266.4,9.9,293.6z"/>
      <path fill="#8E51FF" d="M61.3,634h241.9c28.4,0,51.4,23,51.4,51.4s-23,51.4-51.4,51.4H61.3c-28.4,0-51.4-23-51.4-51.4
        S32.9,634,61.3,634z"/>
    </g></g>
  </svg>
);

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
            <LogoSVG />
            <h1 className="text-violet-500 text-2xl font-bold">ParkEase</h1>
          </div>
        ) : (
          <LogoSVG />
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
