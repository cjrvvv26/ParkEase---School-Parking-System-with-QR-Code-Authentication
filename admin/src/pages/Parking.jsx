import ReportSummaryCard from "../components/charts/ReportSummaryCard";
import AdminBldg from "../components/maps/AdminBldg";
import DynamicMap from "../components/maps/DynamicMap";
import { useNavigate } from "react-router-dom";
import Modal from "../components/Modal";
import { useState, useEffect } from "react";
import useFetch from "../hooks/useFetch";
import Details from "../components/Parking/Details";

export default function Parking() {
  const [isOpen, toggleIsOpenModal] = useState(false);
  const [areaName, setAreaName] = useState("");
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [maps, setMaps] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedShape, setSelectedShape] = useState(null);
  const navigate = useNavigate();
  const { fetchData, loading } = useFetch();

  useEffect(() => {
    const fetchMaps = async () => {
      try {
        const data = await fetchData("map/with-shapes", {
          method: "GET",
        });
        setMaps(data || []);
      } catch (error) {
        console.error("Error fetching maps:", error);
        setMaps([]);
      }
    };
    fetchMaps();
  }, []);

  useEffect(() => {
    if (maps && maps.length > 0 && currentIndex >= maps.length) {
      setCurrentIndex(0);
    }
  }, [maps, currentIndex]);

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/map-editor", {
      state: {
        areaName,
        svgSize: { width: Number(width), height: Number(height) },
      },
    });
    toggleIsOpenModal(false);
  };

  const handleShapeClick = (shape) => {
    setSelectedShape(shape);
  };

  return (
    <>
      {/* Header Page */}
      <header className="flex justify-between px-5 pt-5 items-center">
        <div className="flex flex-col">
          <h1 className="font-bold text-3xl">Parking Management</h1>
          <p className="text-gray-400">
            View and analyze system data through detailed reports and visual
            summaries.
          </p>
        </div>
        {/* Quick Actions (will update) */}
        <div className="flex gap-5"></div>
      </header>
      {/* Parking Report Summary */}
      <div className="flex gap-5 h-[150px] px-5">
        {Array.from({ length: 4 }, () => (
          <ReportSummaryCard />
        ))}
      </div>
      {/* Parking Map and Details */}
      <div className="flex flex-col mx-5 border-gray-200 border rounded-xl mb-5">
        {/* Header Parking Section */}
        <header className="flex justify-between p-5 border-b border-gray-200 w-full">
          <div className="flex gap-3 items-center">
            <h2 className="font-medium text-base">Parking Area Overview</h2>
            <p className="text-xs py-2 px-4 rounded-lg ring ring-violet-500 bg-violet-100 text-violet-500">
              Beta
            </p>
          </div>
          <div className="flex items-center gap-3">
            {/* Redirect to Map Editor */}
            <button
              onClick={() => toggleIsOpenModal(true)}
              className="flex items-center gap-1 py-2 px-3 rounded-full bg-violet-500 text-white"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25"
                />
              </svg>
              <p>Create New Area</p>
            </button>
            {isOpen && (
              <Modal onClose={() => toggleIsOpenModal(false)}>
                <div className="text-xs w-[300px] text-gray-700 flex flex-col gap-5">
                  <h1 className="text-base font-semibold text-gray-700">
                    Create New Area
                  </h1>
                  <form onSubmit={handleSubmit} className="flex flex-col gap-5">
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
                        value={areaName}
                        onChange={(e) => setAreaName(e.target.value)}
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
                            value={height}
                            onChange={(e) => setHeight(e.target.value)}
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
                            value={width}
                            onChange={(e) => setWidth(e.target.value)}
                            className="outline-none w-full rounded-md border border-gray-200 py-1 px-2"
                          />
                          <span className="text-gray-400">px</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-5 w-full">
                      <button
                        type="button"
                        onClick={() => toggleIsOpenModal(false)}
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
            {/* Manage Slots */}
            <button className="flex items-center gap-1 py-2 px-3 rounded-full  text-violet-500 border-violet-500 border">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                />
              </svg>

              <p>Manage</p>
            </button>
          </div>
        </header>
        {/* Content */}
        <main className="flex flex-1">
          {/* Map */}
          <section className="relative px-5 py-20 flex-1">
            {/* Change Parking Area */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className={`size-6 absolute right-5 -translate-x-1/2 top-1/2 ${maps && maps.length > 1 ? "cursor-pointer" : "cursor-not-allowed opacity-50"}`}
              onClick={() =>
                maps &&
                maps.length > 1 &&
                setCurrentIndex((prev) => (prev + 1) % maps.length)
              }
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m8.25 4.5 7.5 7.5-7.5 7.5"
              />
            </svg>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className={`size-6 absolute left-10 top-1/2 -translate-x-1/2 ${maps && maps.length > 1 ? "cursor-pointer" : "cursor-not-allowed opacity-50"}`}
              onClick={() =>
                maps &&
                maps.length > 1 &&
                setCurrentIndex(
                  (prev) => (prev - 1 + maps.length) % maps.length,
                )
              }
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 19.5 8.25 12l7.5-7.5"
              />
            </svg>

            {/* Map Name & Zoom btn */}
            <button className="absolute top-5 left-5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15"
                />
              </svg>
            </button>
            {/* Legends */}
            <div className="flex items-center justify-between absolute top-5 right-5">
              <div className="flex gap-3">
                <div className="flex items-center gap-1 text-xs text-gray-400">
                  <div class="relative flex items-center justify-center w-10 h-10">
                    <div class="absolute w-9 h-9 rounded-full bg-green-100 opacity-50 z-10"></div>

                    <div class="absolute w-6 h-6 rounded-full bg-green-300 opacity-[.3] z-0"></div>

                    <div class="relative w-3 h-3 rounded-full bg-green-500 -z-0"></div>
                  </div>

                  <p>Available</p>
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-400">
                  <div class="relative flex items-center justify-center w-10 h-10">
                    <div class="absolute w-9 h-9 rounded-full bg-rose-100 opacity-50 z-10"></div>

                    <div class="absolute w-6 h-6 rounded-full bg-rose-300 opacity-[.3] z-0"></div>

                    <div class="relative w-3 h-3 rounded-full bg-rose-500 -z-0"></div>
                  </div>
                  <p>Occupied</p>
                </div>
              </div>
            </div>
            {/* Area name */}
            <p className="text-center px-4 py-2 bg-violet-100 text-xs text-violet-500 absolute bottom-5 right-5 rounded-xl ring ring-violet-500">
              {(maps && maps[currentIndex]?.name) || "No Area"}
            </p>
            <div className="h-full min-h-96 flex items-center justify-center">
              {maps && maps.length > 0 ? (
                <DynamicMap
                  shapes={maps[currentIndex].shapes}
                  width={maps[currentIndex].width}
                  height={maps[currentIndex].height}
                  onShapeClick={handleShapeClick}
                />
              ) : (
                <div className="text-center text-gray-400">
                  No parking areas available
                </div>
              )}
            </div>
          </section>
          {/* Parking Details */}
          <Details selectedShape={selectedShape} loading={loading} />
        </main>
      </div>
    </>
  );
}
