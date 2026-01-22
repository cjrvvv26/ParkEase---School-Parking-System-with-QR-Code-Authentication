import React from "react";
import IconButton from "./IconButton";

export default function ToolBox({
  setShapes,
  mapName = "default",
  setIsDrawing,
  isDrawing,
  points,
  selectedShapeId,
  setPoints,
  setClickedShapeId,
}) {
  const addSlot = () => {
    setShapes((prev) => [
      ...prev,
      {
        tempId: crypto.randomUUID(),
        geometry: {
          shape: "rect",
          x: 50,
          y: 50,
          width: 100,
          height: 50,
          rotation: 0,
        },
        metadata: {
          label: "A" + prev.length,
          type: "slot",
          area: mapName,
        },
      },
    ]);
  };

  const addBuilding = () => {
    setIsDrawing(true);
  };

  const handleFinishPolygon = () => {
    if (!isDrawing || !points.length) return;
    setShapes((prev) => [
      ...prev,
      {
        tempId: crypto.randomUUID(),
        geometry: {
          shape: "polygon",
          rotation: "0",
          points,
        },
        metadata: {
          label: "A" + prev.length,
          type: "building",
          area: mapName,
          information: {
            picture: {
              url: null,
              public_id: null,
            },
            description: "",
          },
        },
      },
    ]);
    setIsDrawing(false);
    setPoints([]);
  };

  return (
    <div className="absolute bottom-3 p-2 border border-gray-200 rounded-md bg-white text-gray-700 shadow-md -translate-x-1/2 left-1/2 flex gap-2 items-center">
      <IconButton
        name={"MousePointer2"}
        size={5}
        label={"Select"}
        action={() => {
          if (isDrawing) {
            setIsDrawing(false);
            setPoints([]);
          } else {
            setClickedShapeId(null);
          }
        }}
      />
      <IconButton
        name={"SquareDashed"}
        size={5}
        label={"Slot"}
        action={addSlot}
      />
      <IconButton
        name={"Building"}
        size={5}
        label={"Building"}
        action={() => {
          if (isDrawing) {
            handleFinishPolygon();
          } else {
            setIsDrawing(true);
          }
        }}
      />
    </div>
  );
}
