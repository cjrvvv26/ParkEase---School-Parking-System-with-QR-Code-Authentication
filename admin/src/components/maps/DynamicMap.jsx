import React from "react";

export default function DynamicMap({
  shapes,
  width = 800,
  height = 600,
  onShapeClick,
}) {
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
          onClick={() => onShapeClick && onShapeClick(shape)}
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
          onClick={() => onShapeClick && onShapeClick(shape)}
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
