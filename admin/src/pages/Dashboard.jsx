import { Link } from "react-router-dom";
import ReportSummaryCard from "../components/charts/ReportSummaryCard";
import RevenueChart from "../components/charts/RevenueChart";
import AvgParkingDurationChart from "../components/charts/AvgParkingDurationChart";
import MotorOccupancyChart from "../components/charts/MotorOccupancyChart";
import { useState } from "react";
import Modal from "../components/Modal";
import BotImage from "../assets/images/ai-image.png";

export default function Dashboard() {
  const [isOpen, toggleIsOpenModal] = useState(false);
  return (
    <>
      {/* Header Page */}
      <header className="flex justify-between px-5 pt-5 items-center">
        <div className="flex flex-col">
          <h1 className="font-bold text-3xl">Dashboard</h1>
          <p className="text-gray-400">
            Here's the data summarization of the system
          </p>
        </div>
        {/* Quick Actions */}
        <div className="flex gap-5">
          <button
            onClick={() => toggleIsOpenModal(true)}
            className="bg-gradient-to-tl from-[#2d2d2d] via-violet-900 duration-200 hover:shadow-md hover:shadow-violet-900/40 to-violet-400 text-white rounded-full p-4 flex items-center gap-2"
          >
            <p className="text-nowrap">Analyze with AI</p>
            <svg
              version="1.1"
              id="Layer_1"
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
              x="0px"
              y="0px"
              fill="currentColor"
              viewBox="0 0 24 24"
              enable-background="new 0 0 24 24"
              xml:space="preserve"
              className="text-white size-5"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M7.1,11.1l1.5-4.4h1.9l1.5,4.4l4.4,1.5v1.9l-4.4,1.5l-1.5,4.4H8.6l-1.5-4.4
	l-4.4-1.5v-1.9L7.1,11.1z M9.5,10.2l-0.7,2l-0.6,0.6l-2,0.7l2,0.7l0.6,0.6l0.7,2l0.7-2l0.6-0.6l2-0.7l-2-0.7l-0.6-0.6L9.5,10.2z"
              />
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M16.2,5.2l0.8-2.3h1.1l0.8,2.3l2.3,0.8v1.1l-2.3,0.8l-0.8,2.3h-1.1l-0.8-2.3
	l-2.3-0.8V5.9L16.2,5.2z"
              />
            </svg>
          </button>
          {isOpen && (
            <Modal onClose={() => toggleIsOpenModal(false)}>
              <div className="w-[920px] h-screen overflow-y-scroll max-w-full bg-white rounded-xl shadow-xl overflow-hidden">
                {/* Header */}
                <div className="flex items-start justify-between p-6 border-b">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800">
                      AI Smart Dashboard Analysis
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                      Automated insights and recommendations based on recent
                      parking & access data.
                    </p>
                    <div className="mt-3 flex items-center gap-3 text-xs">
                      <span className="px-2 py-1 rounded bg-gray-100 text-gray-600">
                        Dataset: Last 30 days
                      </span>
                      <span className="px-2 py-1 rounded bg-gray-100 text-gray-600">
                        Model: TrafficPredict v1.2
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-sm text-gray-500">Last updated</div>
                    <div className="text-sm font-medium text-gray-800">
                      Nov 23, 2025 · 09:02
                    </div>
                    <div className="mt-2 inline-flex items-center gap-2">
                      <span className="px-2 py-1 rounded bg-green-50 text-green-700 text-xs font-semibold">
                        Confidence 92%
                      </span>
                      <span className="px-2 py-1 rounded bg-yellow-50 text-yellow-700 text-xs">
                        Probable
                      </span>
                    </div>
                  </div>
                </div>

                {/* KPI row */}
                <div className="p-6 grid grid-cols-4 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-xs text-gray-500">
                      Avg Daily Entries
                    </div>
                    <div className="text-2xl font-semibold text-gray-800 mt-1">
                      1,420
                    </div>
                    <div className="text-xs text-green-600 mt-2">
                      +4.8% vs prev. week
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-xs text-gray-500">Peak Hour</div>
                    <div className="text-2xl font-semibold text-gray-800 mt-1">
                      08:15 AM
                    </div>
                    <div className="text-xs text-gray-600 mt-2">
                      18% of daily traffic
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-xs text-gray-500">
                      Avg Parking Duration
                    </div>
                    <div className="text-2xl font-semibold text-gray-800 mt-1">
                      98m
                    </div>
                    <div className="text-xs text-red-600 mt-2">
                      +6% (longer stays)
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-xs text-gray-500">
                      Available Slots (avg)
                    </div>
                    <div className="text-2xl font-semibold text-gray-800 mt-1">
                      12
                    </div>
                    <div className="text-xs text-gray-600 mt-2">
                      Based on peak periods
                    </div>
                  </div>
                </div>

                {/* Charts & Insights */}
                <div className="p-6 grid grid-cols-2 gap-6 border-t">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-800">
                        Traffic Trend (30d)
                      </h3>
                      <div className="mt-3 h-40 bg-gray-50 rounded-lg border flex items-center justify-center text-gray-400">
                        [Line chart placeholder]
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-gray-800">
                        Occupancy by Area
                      </h3>
                      <div className="mt-3 h-36 bg-gray-50 rounded-lg border flex items-center justify-center text-gray-400">
                        [Stacked bar / map placeholder]
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-800">
                        Key Insights
                      </h3>
                      <ul className="mt-3 space-y-2 text-sm text-gray-700">
                        <li className="flex items-start gap-3">
                          <span className="mt-1 inline-block w-2 h-2 bg-green-500 rounded-full" />
                          Steady increase in weekday entries; Monday–Wednesday
                          show the highest growth.
                        </li>
                        <li className="flex items-start gap-3">
                          <span className="mt-1 inline-block w-2 h-2 bg-yellow-500 rounded-full" />
                          Average parking duration increased by 6% — may
                          indicate longer campus visits.
                        </li>
                        <li className="flex items-start gap-3">
                          <span className="mt-1 inline-block w-2 h-2 bg-red-500 rounded-full" />
                          Gate A experiences frequent congestion between
                          7:30–9:00 AM.
                        </li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-gray-800">
                        Actionable Recommendations
                      </h3>
                      <div className="mt-3 flex flex-col gap-2">
                        <div className="flex items-center justify-between p-3 bg-white border rounded-lg">
                          <div className="text-sm">
                            <div className="font-medium text-gray-800">
                              Stagger class start times
                            </div>
                            <div className="text-xs text-gray-500">
                              Reduce morning gate congestion
                            </div>
                          </div>
                          <div className="text-xs text-green-700 font-semibold">
                            Priority: High
                          </div>
                        </div>

                        <div className="flex items-center justify-between p-3 bg-white border rounded-lg">
                          <div className="text-sm">
                            <div className="font-medium text-gray-800">
                              Reserve short-term slots near main entrance
                            </div>
                            <div className="text-xs text-gray-500">
                              Support quick visits and drop-offs
                            </div>
                          </div>
                          <div className="text-xs text-yellow-700 font-semibold">
                            Priority: Medium
                          </div>
                        </div>

                        <div className="flex items-center justify-between p-3 bg-white border rounded-lg">
                          <div className="text-sm">
                            <div className="font-medium text-gray-800">
                              Notify users of peak times via app
                            </div>
                            <div className="text-xs text-gray-500">
                              Reduce arrivals during peaks
                            </div>
                          </div>
                          <div className="text-xs text-gray-700 font-semibold">
                            Priority: Low
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer: sources & actions */}
                <div className="p-6 border-t flex items-center justify-between gap-4">
                  <div className="text-sm text-gray-600">
                    <div>
                      Data sources: Gate sensors · QR logs · Access database
                    </div>
                    <div className="mt-1 text-xs text-gray-400">
                      Model notes: uses rolling 30-day window. Interpret
                      recommendations accordingly.
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button className="px-4 py-2 text-sm rounded-lg border bg-white">
                      Share
                    </button>
                    <button className="px-4 py-2 text-sm rounded-lg bg-violet-600 text-white">
                      Export PDF
                    </button>
                    <button className="px-4 py-2 text-sm rounded-lg bg-gray-100">
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </Modal>
          )}
          {/* Add Student */}
          {/* <button className="p-4 bg-violet-500 duration-200 hover:shadow-md hover:shadow-violet-500/40 text-white flex items-center gap-2 rounded-full font-medium">
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
                d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>
            <p>Add Student</p>
          </button> */}
          <button>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6 text-gray-400"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
              />
            </svg>
          </button>
        </div>
      </header>
      {/* Report Summary */}
      <div className="flex gap-5 h-[150px] px-5">
        {Array.from({ length: 4 }, () => (
          <ReportSummaryCard />
        ))}
      </div>
      {/* Mid Section */}
      <div className="flex gap-5 px-5">
        {/* Revenue per Semester */}
        <div className="rounded-xl flex-3 h-auto bg-gray-100 ">
          <div className="flex flex-col gap-5 h-full p-5">
            <h1 className="text-base font-medium">Revenue Per School Year</h1>
            {/* Data */}
            <div className=" w-full h-full gap-5">
              <RevenueChart />
            </div>
            {/* Last and Current Sem Comparison */}
            <div className="flex gap-5 h-full rounded-xl">
              {/* Last Semester */}
              <div className="flex flex-col justify-center gap-1 h-full bg-white rounded-xl p-5 flex-1 relative">
                <h2 className="text-sm text-gray-400">Last Semester</h2>
                <p className="font-semibold text-2xl">&#8369; 1,200.00</p>
                <div className="flex gap-1 items-center text-xs text-rose-500 p-2 absolute top-5 right-5 rounded-lg bg-rose-100 border border-rose-500 ">
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
                      d="M2.25 6 9 12.75l4.286-4.286a11.948 11.948 0 0 1 4.306 6.43l.776 2.898m0 0 3.182-5.511m-3.182 5.51-5.511-3.181"
                    />
                  </svg>

                  <p>+10%</p>
                </div>
              </div>
              <div className="flex flex-col justify-center gap-1 h-full bg-white rounded-xl p-5 flex-1 relative">
                <h2 className="text-sm text-gray-400">Current Semester</h2>
                <p className="font-semibold text-2xl">&#8369; 1,500.00</p>
                <div className="flex gap-1 items-center text-xs text-green-500 p-2 absolute top-5 right-5 rounded-lg bg-green-100 border border-green-500 ">
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
                      d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941"
                    />
                  </svg>
                  <p>+10%</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Mid right section */}
        <div className="flex-1 h-full gap-5 flex">
          <div className="flex flex-1 flex-col gap-5">
            {/* Slots Reminder (if already full, show system ratings) */}
            <div className="flex-1 w-full self-start rounded-xl bg-gradient-to-tl to-violet-500 via-violet-900 from-[#2d2d2d]">
              {/* Slots Reminder */}
              <div className="p-5 h-full flex flex-col text-white justify-between">
                <h1 className="font-medium text-base">Parking Slots</h1>
                <h2 className="text-center mt-5">
                  <span className="text-6xl font-medium">5</span> <br /> slots
                  available
                </h2>
                <button className="bg-white rounded-xl py-4 font-medium mt-5 text-gray-700">
                  View Map
                </button>
              </div>
            </div>
            {/* Today's Motor Occupancy Chart */}
            <div className="flex-1 self-start w-full rounded-xl bg-gray-100">
              <div className="p-5 h-full flex flex-col">
                <h1 className="text-base font-medium">
                  Today's Motor Occupancy
                </h1>
                <div className="h-full w-full">
                  <MotorOccupancyChart />
                </div>
                <p className="text-gray-400 text-xs">
                  There are 24 motors parked today
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Mid Section */}
      <div className="flex gap-5 px-5">
        {/* Average Parking Duration */}
        <div className="rounded-xl flex-3 h-auto bg-gray-100 ">
          <div className="flex flex-col gap-2 p-5 h-full">
            <h1 className="text-base font-medium">Average Parking Duration</h1>
            {/* Data */}
            <div className="h-full w-full">
              <AvgParkingDurationChart />
            </div>
          </div>
        </div>
        {/* Lists of Security guard */}
        <div className="flex flex-col rounded-xl bg-gray-100 h-full flex-1">
          <div className="mt-5 mb-3 mx-5 flex items-center justify-between">
            <h1 className="text-base font-medium">Security Guard</h1>
            <button className="py-2 px-4 rounded-full bg-transparent ring ring-violet-500 text-violet-500 flex items-center gap-2">
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
                  d="M12 4.5v15m7.5-7.5h-15"
                />
              </svg>
              <p>New</p>
            </button>
          </div>
          <div className="flex-1 flex flex-col">
            {/* GuardCard */}
            {Array.from({ length: 5 }, () => (
              <div className="flex gap-3 p-2 mx-3 hover:bg-gray-200 cursor-pointer items-center rounded-xl">
                <img
                  src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&fm=jpg&q=60&w=3000"
                  alt=""
                  className="h-12 w-12 object-cover rounded-full"
                />
                <div className="flex flex-col">
                  <h2 className="text-gray-700 font-medium">Jacob Henderson</h2>
                  <p className="text-green-500 text-xs">On duty</p>
                </div>
              </div>
            ))}
            <button className="bg-violet-500 mt-3 mb-5 rounded-xl py-4 text-white mx-5 font-medium">
              View More
            </button>
          </div>
        </div>
      </div>
      {/* Bottom Section */}
      {/* Recent Activites */}
      <div className="bg-gray-100 rounded-xl flex-1 h-full mx-5">
        <div className="h-full flex flex-col py-3">
          {/* Content Header */}
          <div className="flex items-center justify-between mx-5 mb-3 mt-2">
            <h1 className="text-base font-medium">Recent Activities</h1>
            <Link to="/" className="text-sm hover:text-gray-700 text-gray-400">
              See All
            </Link>
          </div>
          {/* Table Header */}
          <div className="grid grid-cols-[2fr_2fr_1fr_1fr] gap-3 pt-2 pb-3 border-b place-items-center border-gray-200 mb-3">
            <p>Name</p>
            <p>Action</p>
            <p>Role</p>
          </div>
          {/* List of Activities */}
          <div className="flex-1 flex flex-col mx-3">
            {Array.from({ length: 6 }, () => (
              <div className="p-2 hover:bg-gray-200 grid grid-cols-[2fr_2fr_1fr_1fr] rounded-xl items-center gap-3">
                <div className="flex gap-3 items-center overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&fm=jpg&q=60&w=3000"
                    alt=""
                    className="h-12 min-w-12 object-cover rounded-full"
                  />
                  <div className="flex flex-col gap-1 overflow-hidden">
                    <h2 className="text-gray-700 font-medium truncate">
                      Jacob Rodriguez
                    </h2>
                    <p className="text-gray-400 text-xs">03/26/25 9:23 AM</p>
                  </div>
                </div>
                <div className="flex items-center  overflow-hidden justify-center">
                  <p className="line-clamp-2 text-ellipsis">Removed a user</p>
                </div>
                <p className=" text-center">Super Admin</p>
                <div className="flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-6 cursor-pointer"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
                    />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
