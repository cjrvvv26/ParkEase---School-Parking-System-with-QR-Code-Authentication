import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ToolBox from "../components/maps/ToolBox";
import PropertiesPanel from "../components/maps/PropertiesPanel";
import Header from "../components/maps/Header";
import Modal from "../components/Modal";
import useFetch from "../hooks/useFetch";
import { Building2, ImagePlus, AlignLeft, Tag, X } from "lucide-react";

function BuildingModal({ building, onChange, onSave, onClose }) {
  const fileRef = useRef();
  const [dragOver, setDragOver] = useState(false);

  const info = building?.metadata?.information || {};
  const previewUrl = info.picture?.url || null;

  const handleFile = (file) => {
    if (!file) return;
    onChange({
      ...building,
      imageFile: file,
      metadata: {
        ...building.metadata,
        information: {
          ...info,
          picture: { url: URL.createObjectURL(file), public_id: null },
        },
      },
    });
  };

  const setField = (key, value) =>
    onChange({
      ...building,
      metadata: {
        ...building.metadata,
        information: { ...info, [key]: value },
      },
    });

  return (
    <div className="w-[420px] flex flex-col">
      {/* Modal header */}
      <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-gray-100">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-emerald-50">
            <Building2 size={16} className="text-emerald-500" strokeWidth={1.8} />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-gray-800">Edit Building</h2>
            <p className="text-[11px] text-gray-400">{info.name || "Unnamed building"}</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition"
        >
          <X size={15} />
        </button>
      </div>

      {/* Body */}
      <div className="px-5 py-4 flex flex-col gap-4">
        {/* Image upload zone */}
        <div
          onClick={() => fileRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            handleFile(e.dataTransfer.files[0]);
          }}
          className={`relative w-full h-44 rounded-2xl border-2 border-dashed cursor-pointer overflow-hidden flex items-center justify-center transition group ${
            dragOver
              ? "border-violet-400 bg-violet-50"
              : "border-gray-200 bg-gray-50 hover:border-violet-300 hover:bg-violet-50/30"
          }`}
        >
          {previewUrl ? (
            <>
              <img src={previewUrl} alt="Building" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex flex-col items-center justify-center gap-1.5">
                <ImagePlus size={22} className="text-white" />
                <span className="text-white text-xs">Change photo</span>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center gap-2 text-gray-300 group-hover:text-violet-400 transition">
              <ImagePlus size={28} strokeWidth={1.3} />
              <div className="text-center">
                <p className="text-xs font-medium">Click or drag to upload</p>
                <p className="text-[11px] mt-0.5">PNG, JPG, WEBP up to 10MB</p>
              </div>
            </div>
          )}
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFile(e.target.files[0])}
          />
        </div>

        {/* Name */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-1.5">
            <Tag size={11} className="text-gray-400" strokeWidth={1.8} />
            <label className="text-[11px] uppercase tracking-wide font-medium text-gray-400">Name</label>
          </div>
          <input
            type="text"
            value={info.name || ""}
            onChange={(e) => setField("name", e.target.value)}
            placeholder="e.g. Main Building"
            className="w-full bg-gray-50 border border-gray-200 text-gray-700 text-xs rounded-xl px-3 py-2 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition"
          />
        </div>

        {/* Description */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-1.5">
            <AlignLeft size={11} className="text-gray-400" strokeWidth={1.8} />
            <label className="text-[11px] uppercase tracking-wide font-medium text-gray-400">Description</label>
          </div>
          <textarea
            value={info.description || ""}
            onChange={(e) => setField("description", e.target.value)}
            placeholder="Brief description of this building..."
            rows={3}
            className="w-full bg-gray-50 border border-gray-200 text-gray-700 text-xs rounded-xl px-3 py-2 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition resize-none"
          />
        </div>
      </div>

      {/* Footer */}
      <div className="px-5 pb-5 flex gap-3">
        <button
          onClick={onClose}
          className="flex-1 py-2.5 rounded-xl border border-gray-200 text-xs text-gray-500 hover:bg-gray-50 transition"
        >
          Cancel
        </button>
        <button
          onClick={onSave}
          className="flex-1 py-2.5 rounded-xl bg-violet-500 hover:bg-violet-600 text-xs text-white font-medium transition"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}


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
  const navigate = useNavigate();
  const {
    areaName: initialAreaName,
    svgSize: initialSvgSize,
    shapes: initialShapes,
    mapId,
    isUpdate,
  } = location.state || {};
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
  const [isUpdateMode, setIsUpdateMode] = useState(isUpdate || false);
  const [currentMapId, setCurrentMapId] = useState(mapId || null);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [isSaving, setIsSaving] = useState(false);
  const [confirmDeleteMap, setConfirmDeleteMap] = useState(false);
  const { fetchData } = useFetch();

  useEffect(() => {
    setCurrentAreaName(initialAreaName || "");
    setCurrentSvgSize(initialSvgSize || { width: 1200, height: 300 });
    if (initialShapes && isUpdate) {
      setShapes(initialShapes);
      setHistory([initialShapes]);
      setCurrentIndex(1);
    }
  }, [initialAreaName, initialSvgSize, initialShapes, isUpdate]);

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

  // Auto-dismiss error message after 3 seconds
  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => {
        setErrorMessage("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

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
      const matrix = svg.getScreenCTM();

      if (!matrix) return;

      const inverseMatrix = matrix.inverse();
      const transformed = pt.matrixTransform(inverseMatrix);

      // Adjust for the viewBox offset (panOffset doesn't need adjustment as it's in viewBox coords)
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
        (s._id || s.tempId) === updatedBuilding.tempId
          ? {
              ...updatedBuilding,
              imageFile: updatedBuilding.imageFile,
            }
          : s,
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
    setZoom((prev) => Math.min(5, prev * 1.2));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(0.1, prev * 0.8));
  };

  const handlePreview = () => {
    console.log("Preview mode");
  };

  const handleDeleteMap = async () => {
    try {
      await fetchData(`/map/${currentMapId}`, { method: 'DELETE' });
      navigate('/parking', { state: { message: 'Map deleted successfully!' } });
    } catch (e) {
      setErrorMessage('Failed to delete map.');
      setConfirmDeleteMap(false);
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setErrorMessage("");

      const { height, width } = currentSvgSize;

      if (!currentAreaName.trim()) {
        setErrorMessage("Please enter an area name.");
        setIsSaving(false);
        return;
      }

      const formData = new FormData();
      formData.append("name", currentAreaName);
      formData.append("height", height);
      formData.append("width", width);

      const cleanedShapes = shapes.map(({ imageFile, ...rest }) => rest);
      formData.append("shapes", JSON.stringify(cleanedShapes));

      shapes.forEach((shape) => {
        if (
          shape.metadata?.type === "building" &&
          shape.imageFile &&
          shape.tempId
        ) {
          formData.append(`building[${shape.tempId}]`, shape.imageFile);
        }
      });

      const endpoint = isUpdateMode ? `/map/${currentMapId}` : "/map";
      const method = isUpdateMode ? "PUT" : "POST";

      console.log(`Sending ${method} request to ${endpoint}`, {
        currentAreaName,
        height,
        width,
        shapesCount: shapes.length,
      });

      const response = await fetchData(endpoint, {
        method: method,
        data: formData,
      });

      console.log("Save response:", response);

      if (response) {
        // Redirect to parking page with success message
        navigate("/parking", {
          state: {
            message: isUpdateMode
              ? "Map updated successfully!"
              : "Map created successfully!",
            type: "success",
          },
        });
      } else {
        setErrorMessage("Unexpected response from server. Please try again.");
        setIsSaving(false);
      }
    } catch (error) {
      console.error("Error saving map:", error);
      console.error("Error response:", error.response?.data);
      setErrorMessage(
        error.response?.data?.error ||
          error.message ||
          "Failed to save map. Please try again.",
      );
      setIsSaving(false);
    }
  };

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
        onDelete={() => setConfirmDeleteMap(true)}
        isUpdateMode={isUpdateMode}
        isSaving={isSaving}
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
              viewBox={`${panOffset.x} ${panOffset.y} ${currentSvgSize.width / zoom} ${currentSvgSize.height / zoom}`}
              width="100%"
              height="100%"
              style={{
                border: "0.1px solid #f3f4f6",
                cursor: isPanning
                  ? "grabbing"
                  : mode === "draw"
                    ? "crosshair"
                    : "default",
              }}
              onMouseMove={(e) => {
                if (isPanning) {
                  const dx = (e.clientX - panStart.x) * zoom;
                  const dy = (e.clientY - panStart.y) * zoom;
                  setPanOffset((prev) => ({
                    x:
                      prev.x -
                      dx /
                        (currentSvgSize.width / (currentSvgSize.width / zoom)),
                    y:
                      prev.y -
                      dy /
                        (currentSvgSize.height /
                          (currentSvgSize.height / zoom)),
                  }));
                  setPanStart({ x: e.clientX, y: e.clientY });
                } else {
                  onMouseMove(e);
                }
              }}
              onMouseUp={(e) => {
                setIsPanning(false);
                stopDrag();
              }}
              onMouseLeave={(e) => {
                setIsPanning(false);
                stopDrag();
              }}
              onMouseDown={(e) => {
                if (e.button === 2) {
                  e.preventDefault();
                  setIsPanning(true);
                  setPanStart({ x: e.clientX, y: e.clientY });
                } else {
                  handleMouseDown(e);
                }
              }}
              onContextMenu={(e) => e.preventDefault()}
            >
              <defs>
                <pattern
                  id="grid"
                  width="50"
                  height="50"
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d="M 50 0 L 0 0 0 50"
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="0.8"
                  />
                </pattern>
              </defs>

              {/* Extended draggable area - allows dragging way beyond canvas boundaries */}
              <rect
                x={-currentSvgSize.width / zoom}
                y={-currentSvgSize.height / zoom}
                width={(currentSvgSize.width * 4) / zoom}
                height={(currentSvgSize.height * 4) / zoom}
                fill="#f3f4f6"
                pointerEvents="auto"
              />

              {/* Grid background */}
              <rect
                width={currentSvgSize.width / zoom}
                height={currentSvgSize.height / zoom}
                fill="white"
                pointerEvents="none"
              />

              {/* Grid pattern overlay */}
              <rect
                width={currentSvgSize.width / zoom}
                height={currentSvgSize.height / zoom}
                fill="url(#grid)"
                pointerEvents="none"
              />

              {/* Border around canvas grid area */}
              <rect
                width={currentSvgSize.width / zoom}
                height={currentSvgSize.height / zoom}
                fill="none"
                stroke="#9ca3af"
                strokeWidth="0.5"
                pointerEvents="none"
              />

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
      {confirmDeleteMap && (
        <Modal onClose={() => setConfirmDeleteMap(false)}>
          <div className="flex flex-col gap-4 w-[360px]">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-rose-50">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 text-rose-500">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                </svg>
              </div>
              <h2 className="font-semibold text-gray-800">Delete Map</h2>
            </div>
            <p className="text-sm text-gray-500">Are you sure you want to delete <strong>{currentAreaName}</strong>? All shapes, slots, and user assignments will be permanently removed.</p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmDeleteMap(false)} className="flex-1 py-2 rounded-xl border border-gray-200 text-sm text-gray-500 hover:bg-gray-50 transition">Cancel</button>
              <button onClick={handleDeleteMap} className="flex-1 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-sm text-white transition">Yes, Delete</button>
            </div>
          </div>
        </Modal>
      )}
      {isBuildingModalOpen && selectedBuilding && (
        <Modal onClose={() => setIsBuildingModalOpen(false)}>
          <BuildingModal
            building={selectedBuilding}
            onChange={setSelectedBuilding}
            onSave={() => handleBuildingUpdate(selectedBuilding)}
            onClose={() => setIsBuildingModalOpen(false)}
          />
        </Modal>
      )}
    </div>
  );
}
