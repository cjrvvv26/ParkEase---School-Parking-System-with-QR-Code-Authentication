import React from "react";
import ToolBox from "./components/maps/ToolBox";
import UpperTool from "./components/maps/UpperTool";

export default function MapEditor() {
  return (
    <div className="min-h-screen w-screen flex">
      {/* Main */}

      <main className="flex-1 relative">
        <UpperTool />
      </main>
      <ToolBox />
    </div>
  );
}
