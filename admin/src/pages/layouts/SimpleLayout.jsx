import { Outlet } from "react-router-dom";
import Navbar from "../../components/Sidebar/Navbar";
import Header from "../../components/Header";
import { useState } from "react";

export default function SimpleLayout() {
  const [show, toggleShow] = useState(true);
  return (
    <div className="min-h-screen w-full bg-gray-100 text-gray-700 flex gap-10 text-sm p-2">
      <div className="h-screen fixed">
        <Navbar toggleShow={toggleShow} show={show} />
      </div>
      <div
        className={`${
          show ? "ml-[258px]" : "ml-[88px]"
        } flex flex-1 flex-col w-screen`}
      >
        <Header />
        <div className="flex flex-col bg-white mt-2 rounded-xl gap-5 min-h-[calc(100vh-104px)]">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
