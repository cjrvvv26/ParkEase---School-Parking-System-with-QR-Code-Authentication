import React from "react";
import useFetch from "../../hooks/useFetch";

export default function DynamicMap({
  shapes,
  width = 800,
  height = 600,
  onShapeClick,
}) {
  const { fetchData } = useFetch();

  const handleSlotDetails = async (shape) => {
    if (!onShapeClick) return;

    if (shape.metadata?.type === "slot") {
      const data = await fetchData("slot", {
        method: "POST",
        data: { _id: shape._id },
      });
      const { createdAt, updatedAt, __v, _id, slotId, ...slotData } = data.slot;
      console.log(data.slot);

      return onShapeClick({ ...shape, ...slotData });
    }

    onShapeClick({ ...shape });
  };

  const renderShape = (shape) => {
    if (shape.geometry.shape === "rect") {
      return (
        <rect
          key={shape._id || shape.tempId}
          x={shape.geometry.x}
          y={shape.geometry.y}
          width={shape.geometry.width}
          height={shape.geometry.height}
          fill={shape.metadata.type === "slot" ? "#d1d5dc" : "#E5E7EB"}
          strokeWidth="1"
          onClick={() => handleSlotDetails(shape)}
          className="cursor-pointer"
        />
      );
    } else if (shape.geometry.shape === "polygon") {
      const pointsStr = shape.geometry.points
        .map((p) => `${p.x},${p.y}`)
        .join(" ");
      return (
        <polygon
          key={shape._id || shape.tempId}
          points={pointsStr}
          fill={shape.metadata.type === "slot" ? "#F3F4F6" : "#E5E7EB"}
          strokeWidth="1"
          onClick={() => handleSlotDetails(shape)}
          className="cursor-pointer"
        />
      );
    }
    return null;
  };

  if (!shapes) return <div>No shapes</div>;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      style={{ width: "100%", height: "100%" }}
    >
      {shapes.map(renderShape)}
    </svg>
  );
}
