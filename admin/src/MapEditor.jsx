import React, { useState } from "react";
import ToolBox from "./components/maps/ToolBox";
import PropertiesPanel from "./components/maps/PropertiesPanel";
import Header from "./components/maps/Header";

function SlotShape({
  shape,
  onClick,
  onMouseDown,
  rotate,
  height,
  width,
  isSelected,
  isDragging,
  isHovering,
  onMouseEnter,
  onMouseLeave,
}) {
  return (
    <g
      transform={`translate(${shape.geometry.x}, ${shape.geometry.y})`}
      onMouseDown={(e) => onMouseDown(e, shape)}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {(isSelected || isDragging) && (
        <text y={-5} className="text-xs" fill="#8e51ff">
          {shape.metadata.label}
        </text>
      )}
      <rect
        width={shape.geometry.width}
        height={shape.geometry.height}
        fill="#E5E7EB"
        stroke="#9CA3AF"
        className={
          isDragging
            ? "cursor-grabbing"
            : isHovering
            ? "cursor-grab"
            : "cursor-default"
        }
      />
    </g>
  );
}

export default function MapEditor() {
  const [shapes, setShapes] = useState([]);
  const [dragging, setDragging] = useState(null);
  const [clickedShapeId, setClickedShapeId] = useState(null);
  const [hoveredShapeId, setHoveredShapeId] = useState(null);

  const startDrag = (e, shape) => {
    e.stopPropagation();

    setDragging({
      id: shape._id || shape.tempId,
      offsetX: e.clientX - shape.geometry.x,
      offsetY: e.clientY - shape.geometry.y,
    });
  };

  const onMouseMove = (e) => {
    if (!dragging) return;

    setShapes((prev) =>
      prev.map((s) =>
        (s._id || s.tempId) === dragging.id
          ? {
              ...s,
              geometry: {
                ...s.geometry, // ✅ KEEP width & height
                x: e.clientX - dragging.offsetX,
                y: e.clientY - dragging.offsetY,
              },
            }
          : s
      )
    );
  };

  const stopDrag = () => {
    setDragging(null);
  };

  return (
    <div className="min-h-screen flex flex-col select-none">
      <Header />

      <main className="flex-1 relative flex">
        {/* Main */}
        <section className="flex-1 relative flex items-end bg-gray-50">
          <svg
            viewBox="0 0 1200 300"
            width="100%"
            height="100%"
            fill="black"
            onMouseMove={onMouseMove}
            onMouseUp={stopDrag}
            onMouseLeave={stopDrag}
          >
            {shapes.map((shape) => (
              <SlotShape
                key={shape.tempId || shape._id}
                shape={shape}
                onMouseDown={startDrag}
                onClick={() => {
                  setClickedShapeId(shape._id || shape.tempId);
                }}
                isSelected={clickedShapeId === (shape._id || shape.tempId)}
                isDragging={dragging?.id === (shape._id || shape.tempId)}
                isHovering={hoveredShapeId === (shape._id || shape.tempId)}
                onMouseEnter={() =>
                  setHoveredShapeId(shape._id || shape.tempId)
                }
                onMouseLeave={() => setHoveredShapeId(null)}
              />
            ))}
          </svg>
          <ToolBox setShapes={setShapes} />
        </section>
        <PropertiesPanel />
      </main>
    </div>
  );
}
