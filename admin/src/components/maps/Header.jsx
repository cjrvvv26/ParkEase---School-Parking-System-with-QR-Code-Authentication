import React from "react";
import Button from "./Button";
import { Eye } from "lucide-react";

export default function Header({
  areaName,
  onNew,
  onUndo,
  onRedo,
  onZoomIn,
  onZoomOut,
  onPreview,
  onSave,
}) {
  return (
    <div className="flex flex-col gap-3 text-gray-700 text-xs p-2 border-b border-gray-200">
      <section className="flex relative justify-between">
        <div className="flex gap-3 items-center">
          <h1 className="text-base font-semibold">ParkEase - Map Editor</h1>
          <p className="py-1 px-2 rounded-sm border border-violet-500 text-violet-500">
            BETA
          </p>
        </div>
        {/* Area Name */}
        <p className="-translate-x-1/2 left-1/2 absolute font-semibold text-base">
          {areaName || "Admin Bldg"}
        </p>
        {/* Super Admin Profile */}
        <div className="flex items-center gap-3">
          <p className="">Clarence</p>
          <img
            src="https://plus.unsplash.com/premium_photo-1690407617542-2f210cf20d7e?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt=""
            className="h-8 w-8 object-cover rounded-full"
          />
        </div>
      </section>
      {/* Tools */}
      <section className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Button name={"New"} onClick={onNew} />
          <Button name={"Undo"} onClick={onUndo} />
          <Button name={"Redo"} onClick={onRedo} />
          <Button name={"Zoom In"} onClick={onZoomIn} />
          <Button name={"Zoom Out"} onClick={onZoomOut} />
        </div>
        <div className="flex gap-3">
          <button
            onClick={onPreview}
            className="rounded-md py-2 px-3 border border-gray-200 flex gap-2 items-center hover:text-gray-500"
          >
            <Eye strokeWidth={1.5} className="size-4" />
            <span>Preview</span>
          </button>
          <button
            onClick={onSave}
            className="rounded-md py-2 px-3 bg-violet-500 text-white"
          >
            Save
          </button>
        </div>
      </section>
    </div>
  );
}
