import React from "react";
import IconButton from "./IconButton";

export default function ToolBox({ setShapes, mapName = "default" }) {
  const addSlot = () => {
    setShapes((prev) => [
      ...prev,
      {
        tempId: crypto.randomUUID(),
        geometry: {
          shape: "rect",
          x: "50",
          y: "50",
          width: "100",
          height: "50",
          rotation: "0",
        },
        metadata: {
          label: "A" + prev.length,
          type: "slot",
          area: mapName,
        },
      },
    ]);
  };

  return (
    <div className="absolute bottom-3 p-2 border border-gray-200 rounded-md bg-white text-gray-700 shadow-md -translate-x-1/2 left-1/2 flex gap-2 items-center">
      <IconButton name={"MousePointer2"} size={5} label={"Select"} />
      <IconButton
        name={"SquareDashed"}
        size={5}
        label={"Slot"}
        action={addSlot}
      />
      <IconButton name={"Building"} size={5} label={"Building"} />
    </div>
  );
}
