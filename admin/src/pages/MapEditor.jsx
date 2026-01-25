import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import ToolBox from "../components/maps/ToolBox";
import PropertiesPanel from "../components/maps/PropertiesPanel";
import Header from "../components/maps/Header";
import Modal from "../components/Modal";
import useFetch from "../hooks/useFetch";

function SlotShape({
  shape,
  onClick,
  onMouseDown,
  isDragging,
  isHovering,
  onMouseEnter,
  onMouseLeave,
  onBuildingClick,
}) {
  const renderShape = () => {
    if (shape.geometry.shape === "rect") {
      return (
        <rect
          width={shape.geometry.width}
          height={shape.geometry.height}
          fill="#d1d5dc"
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
          fill="#E5E7EB"
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
      {shape.geometry.shape === "polygon" && (
        <g>
          <circle
            cx={labelPos.x}
            cy={labelPos.y + 10}
            r="5"
            fill="#05df72"
            className="animate-pulse hover:cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              onBuildingClick(shape);
            }}
          />
          <circle
            cx={labelPos.x}
            cy={labelPos.y + 10}
            r="8"
            opacity={50}
            fill="#b9f8cf"
            className="animate-pulse"
            onClick={(e) => {
              e.stopPropagation();
              onBuildingClick(shape);
            }}
          />
        </g>
      )}
    </g>
  );
}

export default function MapEditor() {
  const location = useLocation();
  const { areaName: initialAreaName, svgSize: initialSvgSize } =
    location.state || {};
  const [currentAreaName, setCurrentAreaName] = useState(initialAreaName || "");
  const [currentSvgSize, setCurrentSvgSize] = useState(
    initialSvgSize || { width: 1200, height: 300 },
  );
  const [shapes, setShapes] = useState([]);
  const [points, setPoints] = useState([]);
  const [dragging, setDragging] = useState(null);
  const [clickedShapeId, setClickedShapeId] = useState(null);
  const [hoveredShapeId, setHoveredShapeId] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [history, setHistory] = useState([[]]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFromHistory, setIsFromHistory] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [newAreaName, setNewAreaName] = useState("");
  const [newWidth, setNewWidth] = useState("");
  const [newHeight, setNewHeight] = useState("");
  const [mode, setMode] = useState("select");
  const [errorMessage, setErrorMessage] = useState("");
  const [isBuildingModalOpen, setIsBuildingModalOpen] = useState(false);
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const { fetchData } = useFetch();

  useEffect(() => {
    setCurrentAreaName(initialAreaName || "");
    setCurrentSvgSize(initialSvgSize || { width: 1200, height: 300 });
  }, [initialAreaName, initialSvgSize]);

  useEffect(() => {
    if (!isFromHistory) {
      setHistory((prev) => {
        const newHistory = prev.slice(0, currentIndex + 1);
        newHistory.push(shapes);
        return newHistory;
      });
      setCurrentIndex((prev) => prev + 1);
    }
  }, [shapes, isFromHistory]);

  const startDrag = (e, shape) => {
    if (mode !== "select") return;
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
    if (dragging) {
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
    }
  };

  const handleMouseDown = (e) => {
    if (mode === "draw") {
      const svg = e.currentTarget;
      const pt = svg.createSVGPoint();
      pt.x = e.clientX;
      pt.y = e.clientY;
      const matrix = svg.getScreenCTM().inverse();
      const transformed = pt.matrixTransform(matrix);
      const x = transformed.x;
      const y = transformed.y;

      setPoints((prevPoints) => [...prevPoints, { x, y }]);
    }
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

  const handleBuildingUpdate = (updatedBuilding) => {
    setShapes((prev) =>
      prev.map((s) =>
        (s._id || s.tempId) === updatedBuilding.tempId ? updatedBuilding : s,
      ),
    );
    setSelectedBuilding(null);
    setIsBuildingModalOpen(false);
  };

  const openBuildingModal = (shape) => {
    setSelectedBuilding(shape);
    setIsBuildingModalOpen(true);
  };

  const handleDeleteShape = (id) => {
    setShapes((prev) => prev.filter((s) => (s._id || s.tempId) !== id));
  };

  const handleNew = () => {
    setIsOpen(true);
  };

  const handleUndo = () => {
    if (isDrawing && points.length > 0) {
      setPoints(points.slice(0, -1));
    } else if (currentIndex > 0) {
      setIsFromHistory(true);
      setCurrentIndex(currentIndex - 1);
      setShapes(history[currentIndex - 1]);
      setIsFromHistory(false);
    }
  };

  const handleRedo = () => {
    if (currentIndex < history.length - 1) {
      setIsFromHistory(true);
      setCurrentIndex(currentIndex + 1);
      setShapes(history[currentIndex + 1]);
      setIsFromHistory(false);
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

  const handleSave = async () => {
    console.log("Save", shapes);
    const { height, width } = currentSvgSize;
    const data = { name: currentAreaName, height, width, shapes };
    try {
      const res = await fetchData("/map", {
        method: "POST",
        data,
      });
      console.log(res.data);
    } catch (error) {
      console.log(error.response.data);
    }
  };

  const fileToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
    });

  const handleNewSubmit = (e) => {
    e.preventDefault();
    setCurrentAreaName(newAreaName);
    setCurrentSvgSize({ width: Number(newWidth), height: Number(newHeight) });
    setShapes([]);
    setPoints([]);
    setIsDrawing(false);
    setClickedShapeId(null);
    setHoveredShapeId(null);
    setZoom(1);
    setHistory([[]]);
    setCurrentIndex(0);
    setMode("select");
    setIsOpen(false);
  };
  const stopDrag = () => {
    setDragging(null);
  };
  return (
    <div className="min-h-screen flex flex-col select-none">
      <Header
        areaName={currentAreaName}
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
        <section
          className="flex-1 relative flex items-end bg-gray-50"
          style={{ height: "600px" }}
        >
          {errorMessage && (
            <div className="absolute top-2 left-1/2 transform -translate-x-1/2 text-xs bg-rose-500 text-white px-4 py-2 rounded">
              {errorMessage}
            </div>
          )}
          <div
            style={{
              height: "100%",
              width: "100%",
              overflow: "auto",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <svg
              viewBox={`0 0 ${currentSvgSize.width / zoom} ${currentSvgSize.height / zoom}`}
              width="100%"
              height="100%"
              fill="black"
              style={{
                border: "1px solid #ccc",
                cursor: mode === "draw" ? "crosshair" : "default",
              }}
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
                    if (mode === "select") {
                      setClickedShapeId(shape._id || shape.tempId);
                    }
                  }}
                  isSelected={clickedShapeId === (shape._id || shape.tempId)}
                  isDragging={dragging?.id === (shape._id || shape.tempId)}
                  isHovering={hoveredShapeId === (shape._id || shape.tempId)}
                  onMouseEnter={() =>
                    setHoveredShapeId(shape._id || shape.tempId)
                  }
                  onMouseLeave={() => setHoveredShapeId(null)}
                  onBuildingClick={openBuildingModal}
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
          </div>
          <ToolBox
            setShapes={setShapes}
            setIsDrawing={setIsDrawing}
            isDrawing={isDrawing}
            points={points}
            setPoints={setPoints}
            setClickedShapeId={setClickedShapeId}
            setMode={setMode}
            mode={mode}
            setErrorMessage={setErrorMessage}
          />
        </section>
        <PropertiesPanel
          selectedShape={selectedShape}
          onUpdateShape={handleUpdateShape}
          onDeleteShape={handleDeleteShape}
        />
      </main>
      {isOpen && (
        <Modal onClose={() => setIsOpen(false)}>
          <div className="text-xs w-[300px] text-gray-700 flex flex-col gap-5">
            <h1 className="text-base font-semibold text-gray-700">
              Create New Area
            </h1>
            <form onSubmit={handleNewSubmit} className="flex flex-col gap-5">
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="name"
                  className="self-start text-xs text-gray-400"
                >
                  Area name
                </label>
                <input
                  id="name"
                  type="text"
                  value={newAreaName}
                  onChange={(e) => setNewAreaName(e.target.value)}
                  className="outline-none w-full rounded-md border border-gray-200 py-1 px-2"
                />
              </div>
              <div className="flex gap-3 items-center">
                <div className="flex flex-col gap-1">
                  <label
                    htmlFor="height"
                    className="self-start text-xs text-gray-400"
                  >
                    Height
                  </label>
                  <div className="flex gap-1 items-end">
                    <input
                      id="height"
                      type="number"
                      value={newHeight}
                      onChange={(e) => setNewHeight(e.target.value)}
                      className="outline-none w-full rounded-md border border-gray-200 py-1 px-2"
                    />
                    <span className="text-gray-400">px</span>
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <label
                    htmlFor="width"
                    className="self-start text-xs text-gray-400"
                  >
                    Width
                  </label>
                  <div className="flex gap-1 items-end">
                    <input
                      id="width"
                      type="number"
                      value={newWidth}
                      onChange={(e) => setNewWidth(e.target.value)}
                      className="outline-none w-full rounded-md border border-gray-200 py-1 px-2"
                    />
                    <span className="text-gray-400">px</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-5 w-full">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="border w-full border-gray-200 py-2 px-4 rounded"
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="bg-violet-500 w-full text-white py-2 px-4 rounded"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </Modal>
      )}
      {isBuildingModalOpen && selectedBuilding && (
        <Modal onClose={() => setIsBuildingModalOpen(false)}>
          <div className="text-xs w-[300px] text-gray-700 flex flex-col gap-5">
            <h1 className="text-base font-semibold text-gray-700">
              Edit Building
            </h1>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleBuildingUpdate(selectedBuilding);
              }}
              className="flex flex-col gap-5"
            >
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="bldg-pic"
                  className="self-start text-xs text-gray-400"
                >
                  Picture
                </label>
                {selectedBuilding.metadata?.information?.picture?.url && (
                  <img
                    src={selectedBuilding.metadata.information.picture?.url}
                    alt="Current Building"
                    className="w-20 h-20 object-cover rounded mb-2"
                  />
                )}
                <input
                  id="bldg-pic"
                  type="file"
                  onChange={async (e) => {
                    const file = e.target.files[0];
                    if (!file) return;

                    const base64 = await fileToBase64(file);

                    setSelectedBuilding({
                      ...selectedBuilding,
                      imageFile: file, // ✅ IMPORTANT
                      metadata: {
                        ...selectedBuilding.metadata,
                        information: {
                          ...selectedBuilding.metadata.information,
                          picture: base64, // preview only
                        },
                      },
                    });
                  }}
                  className="outline-none w-full rounded-md border border-gray-200 py-1 px-2"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="bldg-name"
                  className="self-start text-xs text-gray-400"
                >
                  Name
                </label>
                <input
                  id="bldg-name"
                  type="text"
                  value={selectedBuilding.metadata?.information?.name || ""}
                  onChange={(e) =>
                    setSelectedBuilding({
                      ...selectedBuilding,
                      metadata: {
                        ...selectedBuilding.metadata,
                        information: {
                          ...selectedBuilding.metadata.information,
                          name: e.target.value,
                        },
                      },
                    })
                  }
                  className="outline-none w-full rounded-md border border-gray-200 py-1 px-2"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="bldg-desc"
                  className="self-start text-xs text-gray-400"
                >
                  Description
                </label>
                <textarea
                  id="bldg-desc"
                  value={
                    selectedBuilding.metadata?.information?.description || ""
                  }
                  onChange={(e) =>
                    setSelectedBuilding({
                      ...selectedBuilding,
                      metadata: {
                        ...selectedBuilding.metadata,
                        information: {
                          ...selectedBuilding.metadata.information,
                          description: e.target.value,
                        },
                      },
                    })
                  }
                  className="outline-none w-full rounded-md border border-gray-200 py-1 px-2 resize-none h-20"
                />
              </div>

              <div className="flex items-center gap-5 w-full">
                <button
                  type="button"
                  onClick={() => setIsBuildingModalOpen(false)}
                  className="border w-full border-gray-200 py-2 px-4 rounded"
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="bg-violet-500 w-full text-white py-2 px-4 rounded"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </Modal>
      )}
    </div>
  );
}
