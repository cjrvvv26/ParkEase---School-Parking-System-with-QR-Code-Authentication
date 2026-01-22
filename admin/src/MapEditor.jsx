import React, { useState, useEffect } from "react";
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
  const renderShape = () => {
    if (shape.geometry.shape === "rect") {
      return (
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
      );
    } else if (shape.geometry.shape === "polygon") {
      const pointsStr = shape.geometry.points
        .map((p) => `${p.x},${p.y}`)
        .join(" ");
      return (
        <polygon
          points={pointsStr}
          fill="#D1D5DB"
          stroke="#6B7280"
          className={
            isDragging
              ? "cursor-grabbing"
              : isHovering
                ? "cursor-grab"
                : "cursor-default"
          }
        />
      );
    }
    return null;
  };

  const getLabelPosition = () => {
    if (shape.geometry.shape === "rect") {
      return { x: shape.geometry.width / 2, y: -5 };
    } else if (shape.geometry.shape === "polygon") {
      const points = shape.geometry.points;
      const cx = points.reduce((sum, p) => sum + p.x, 0) / points.length;
      const cy = points.reduce((sum, p) => sum + p.y, 0) / points.length;
      return { x: cx, y: cy - 5 };
    }
    return { x: 0, y: -5 };
  };

  const labelPos = getLabelPosition();

  return (
    <g
      transform={`translate(${shape.geometry.x || 0}, ${shape.geometry.y || 0})`}
      onMouseDown={(e) => onMouseDown(e, shape)}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <g
        transform={
          shape.geometry.shape === "rect"
            ? `rotate(${shape.geometry.rotation || 0} ${shape.geometry.width / 2} ${shape.geometry.height / 2})`
            : ""
        }
      >
        {renderShape()}
      </g>
      <text
        x={labelPos.x}
        y={labelPos.y}
        className="text-xs"
        fill="#8e51ff"
        fontSize="12"
      >
        {typeof shape.metadata?.label === "string"
          ? shape.metadata.label
          : "No Label"}
      </text>
    </g>
  );
}

export default function MapEditor() {
  const [shapes, setShapes] = useState([]);
  const [points, setPoints] = useState([]);
  const [dragging, setDragging] = useState(null);
  const [clickedShapeId, setClickedShapeId] = useState(null);
  const [hoveredShapeId, setHoveredShapeId] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [history, setHistory] = useState([[]]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [isUndoing, setIsUndoing] = useState(false);

  useEffect(() => {
    if (!isUndoing) {
      setHistory((prev) => [...prev.slice(0, historyIndex + 1), shapes]);
      setHistoryIndex((prev) => prev + 1);
    }
  }, [shapes, isUndoing]);

  const startDrag = (e, shape) => {
    e.stopPropagation();

    const svg = e.currentTarget.ownerSVGElement || e.currentTarget;
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const matrix = svg.getScreenCTM().inverse();
    const transformed = pt.matrixTransform(matrix);

    if (shape.geometry.shape === "polygon") {
      setDragging({
        id: shape._id || shape.tempId,
        type: "polygon",
        initialPoints: shape.geometry.points,
        startX: transformed.x,
        startY: transformed.y,
      });
    } else {
      setDragging({
        id: shape._id || shape.tempId,
        type: "rect",
        initialX: shape.geometry.x,
        initialY: shape.geometry.y,
        startX: transformed.x,
        startY: transformed.y,
      });
    }
  };

  const onMouseMove = (e) => {
    if (!dragging) return;

    const svg = e.currentTarget;
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const matrix = svg.getScreenCTM().inverse();
    const transformed = pt.matrixTransform(matrix);
    const dx = transformed.x - dragging.startX;
    const dy = transformed.y - dragging.startY;

    if (dragging.type === "rect") {
      setShapes((prev) =>
        prev.map((s) =>
          (s._id || s.tempId) === dragging.id
            ? {
                ...s,
                geometry: {
                  ...s.geometry,
                  x: dragging.initialX + dx,
                  y: dragging.initialY + dy,
                },
              }
            : s,
        ),
      );
    } else if (dragging.type === "polygon") {
      setShapes((prev) =>
        prev.map((s) =>
          (s._id || s.tempId) === dragging.id
            ? {
                ...s,
                geometry: {
                  ...s.geometry,
                  points: dragging.initialPoints.map((p) => ({
                    x: p.x + dx,
                    y: p.y + dy,
                  })),
                },
              }
            : s,
        ),
      );
    }
  };

  const handleMouseDown = (e) => {
    if (!isDrawing) return;

    const svg = e.currentTarget;
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const matrix = svg.getScreenCTM().inverse();
    const transformed = pt.matrixTransform(matrix);
    const x = transformed.x;
    const y = transformed.y;

    setPoints((prevPoints) => [...prevPoints, { x, y }]);
  };

  const selectedShape = shapes.find(
    (s) => (s._id || s.tempId) === clickedShapeId,
  );

  const handleUpdateShape = (updatedShape) => {
    setShapes((prev) =>
      prev.map((s) =>
        (s._id || s.tempId) === updatedShape.tempId ? updatedShape : s,
      ),
    );
  };

  const handleDeleteShape = (id) => {
    setShapes((prev) => prev.filter((s) => (s._id || s.tempId) !== id));
  };

  const handleNew = () => {
    setShapes([]);
    setPoints([]);
    setIsDrawing(false);
    setClickedShapeId(null);
    setHoveredShapeId(null);
  };

  const handleUndo = () => {
    if (isDrawing && points.length > 0) {
      setPoints(points.slice(0, -1));
    } else if (historyIndex > 0) {
      setIsUndoing(true);
      setHistoryIndex(historyIndex - 1);
      setShapes(history[historyIndex - 1]);
      setIsUndoing(false);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      setIsUndoing(true);
      setHistoryIndex(historyIndex + 1);
      setShapes(history[historyIndex + 1]);
      setIsUndoing(false);
    }
  };

  const handleZoomIn = () => {
    setZoom((prev) => Math.max(0.1, prev * 0.9));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.min(5, prev * 1.1));
  };

  const handlePreview = () => {
    console.log("Preview mode");
  };

  const handleSave = () => {
    console.log("Save", shapes);
    // TODO: send to backend
  };
  const stopDrag = () => {
    setDragging(null);
  };
  return (
    <div className="min-h-screen flex flex-col select-none">
      <Header
        onNew={handleNew}
        onUndo={handleUndo}
        onRedo={handleRedo}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onPreview={handlePreview}
        onSave={handleSave}
      />

      <main className="flex-1 relative flex">
        {/* Main */}
        <section className="flex-1 relative flex items-end bg-gray-50">
          <svg
            viewBox={`0 0 ${1200 * zoom} ${300 * zoom}`}
            width="100%"
            height="100%"
            fill="black"
            onMouseMove={onMouseMove}
            onMouseUp={stopDrag}
            onMouseLeave={stopDrag}
            onMouseDown={handleMouseDown}
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
            {isDrawing && points.length > 1 && (
              <polygon
                points={points.map((p) => `${p.x},${p.y}`).join(" ")}
                fill="none"
                stroke="blue"
                strokeWidth="2"
                strokeDasharray="5,5"
              />
            )}
            {isDrawing &&
              points.map((p, i) => (
                <circle key={i} cx={p.x} cy={p.y} r="3" fill="red" />
              ))}
          </svg>
          <ToolBox
            setShapes={setShapes}
            setIsDrawing={setIsDrawing}
            isDrawing={isDrawing}
            points={points}
            setPoints={setPoints}
            setClickedShapeId={setClickedShapeId}
          />
        </section>
        <PropertiesPanel
          selectedShape={selectedShape}
          onUpdateShape={handleUpdateShape}
          onDeleteShape={handleDeleteShape}
        />
      </main>
    </div>
  );
}
