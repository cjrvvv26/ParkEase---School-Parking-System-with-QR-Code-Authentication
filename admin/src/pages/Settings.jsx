import React from "react";

export default function Settings() {
  return (
    <>
      {/* Header Page */}
      <header className="flex justify-between px-5 pt-5 items-center">
        <div className="flex flex-col">
          <h1 className="font-bold text-3xl">Settings</h1>
          <p className="text-gray-400">
            Customize your preference system theme.
          </p>
        </div>
      </header>
      <div className="flex gap-5 mx-5">
        {Array.from({ length: 2 }, (_, index) => (
          <div
            key={index}
            className="flex select-none cursor-pointer flex-col flex-1 rounded-xl border-gray-200 border"
          >
            <header className="flex items-center justify-between p-5 border-b border-gray-200">
              <div className="flex flex-col">
                <h1 className="text-base font-medium">
                  {index <= 0 ? "Light" : "Dark"} Theme
                </h1>
                <p className="text-gray-400 text-xs">
                  Select and change your system theme to{" "}
                  {index <= 0 ? "light" : "dark"}.
                </p>
              </div>
              {index <= 0 && (
                <span className="px-4 py-2 text-xs rounded-xl ring ring-green-500 bg-green-100 text-green-500">
                  Active
                </span>
              )}
            </header>
            <main className="h-[350px] p-5 flex items-center justify-center">
              <section
                className={`${
                  index <= 0 ? "bg-white" : "bg-[#2d2d2d]"
                } border rounded-xl border-gray-200 h-full w-full flex flex-col p-5`}
              >
                <header
                  className={`${
                    index <= 0 ? "bg-gray-100" : "bg-[#3d3d3d]"
                  } h-[50px] flex items-center rounded-xl gap-2 px-5 justify-end`}
                >
                  <span className="h-5 w-5 rounded-sm bg-violet-500"></span>
                  <span className="h-5 w-5 rounded-sm bg-rose-500"></span>
                </header>
                <div className="flex gap-5 mt-5 flex-1">
                  <div
                    className={`${
                      index <= 0 ? "bg-gray-100" : "bg-[#3d3d3d]"
                    } flex-1  rounded-xl h-full`}
                  ></div>
                  <div
                    className={`${
                      index <= 0 ? "bg-gray-100" : "bg-[#3d3d3d]"
                    } rounded-xl h-full w-[150px]`}
                  ></div>
                </div>
              </section>
            </main>
          </div>
        ))}
      </div>
    </>
  );
}
