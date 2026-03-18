import { Outlet } from "react-router-dom";
import Navbar from "../../components/Sidebar/Navbar";
import Header from "../../components/Header";
import { useState } from "react";
import { useSelector } from "react-redux";

export default function DefaultLayout() {
  const [show, toggleShow] = useState(true);
  const { theme } = useSelector((s) => s.auth);
  const dark = theme === "dark";
  document.documentElement.style.overflowY = "scroll";
  document.body.style.width = "100%";
  return (
    <div className={`min-h-screen w-full flex gap-10 text-sm p-2 ${dark ? "bg-[#1a1a1a] text-gray-200" : "bg-gray-100 text-gray-700"}`}>
      <div className="h-screen fixed top-2">
        <Navbar toggleShow={toggleShow} show={show} />
      </div>
      <div className={`${show ? "ml-[258px]" : "ml-[88px]"} flex flex-1 flex-col w-screen`}>
        <Header />
        <div className={`flex flex-col mt-2 rounded-xl gap-5 min-h-[calc(100vh-104px)] ${dark ? "bg-[#242424]" : "bg-white"}`}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
