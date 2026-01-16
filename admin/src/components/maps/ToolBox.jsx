import React from "react";

export default function ToolBox() {
  return (
    <div className="w-80 h-screen text-xs text-gray-700 border-l border-gray-200 p-5 flex flex-col overflow-hidden relative">
      {/* UPPER SECTION */}
      <section className="flex flex-col overflow-y-auto gap-5 flex-1">
        {/* TOOLBOX */}
        <div className="flex flex-col gap-5 h-[9999px]">
          <h1 className="font-semibold text-xl">Toolbox</h1>
        </div>
        {/* PROPERTIES */}
        <div className="flex flex-col gap-5">
          <h1 className="font-semibold text-xl">Properties</h1>
        </div>
      </section>
      {/* BTN's */}
      <section className="flex gap-3 bg-white absolute w-full bottom-0 p-5 left-0 items-center">
        <button className="text-violet-500 border-2 border-violet-500 w-full rounded-md py-2 font-medium text-base">
          Back
        </button>
        <button className="text-white border-2 border-violet-500 bg-violet-500 w-full rounded-md py-2 font-medium text-base">
          Save
        </button>
      </section>
    </div>
  );
}
