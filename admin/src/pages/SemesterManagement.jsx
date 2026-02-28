import React, { useState, useEffect } from "react";
import { CirclePlus, Settings } from "lucide-react";
import { Link } from "react-router-dom";
import ReportSummaryCard from "../components/charts/ReportSummaryCard";
import CurrentSemesterCard from "../components/semesters/CurrentSemesterCard";
import PreviousSemestersTable from "../components/semesters/PreviousSemestersTable";
import useFetch from "../hooks/useFetch";

export default function SemesterManagement() {
  const { fetchData, loading } = useFetch();
  const [currentSemester, setCurrentSemester] = useState(null);
  const [previousSemesters, setPreviousSemesters] = useState([]);
  const [stats, setStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);

  // Fetch current semester and statistics
  useEffect(() => {
    const fetchSemesterData = async () => {
      try {
        setLoadingStats(true);

        // Try to get current semester (may not exist)
        try {
          const currentRes = await fetchData("/semester/current");
          if (currentRes?.data) {
            setCurrentSemester(currentRes.data);
            console.log(currentRes.data);
          }
        } catch (err) {
          // No active semester is fine, just log it
          console.log("No active semester found");
          setCurrentSemester(null);
        }

        // Always fetch stats regardless of whether there's an active semester
        const statsRes = await fetchData("/semester/stats");
        if (statsRes?.data) {
          setStats(statsRes.data);
          console.log(statsRes);
        }
      } catch (error) {
        console.error("Error fetching semester data:", error);
      } finally {
        setLoadingStats(false);
      }
    };

    fetchSemesterData();
  }, []);

  // Fetch previous semesters
  useEffect(() => {
    const fetchPreviousSemesters = async () => {
      try {
        const res = await fetchData("/semester");
        if (res?.data) {
          const expired = res.data.filter((s) => s.status === "expired");
          setPreviousSemesters(expired);
        }
      } catch (error) {
        console.error("Error fetching previous semesters:", error);
      }
    };

    fetchPreviousSemesters();
  }, []);

  const handleUpdateSemesterName = async (id, newName) => {
    try {
      setUpdateLoading(true);
      const res = await fetchData(`/semester/${id}`, {
        method: "PUT",
        data: { name: newName },
      });

      if (res?.data) {
        setCurrentSemester(res.data);
      }
    } catch (error) {
      console.error("Error updating semester:", error);
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleExpireSemester = async () => {
    if (
      !currentSemester ||
      !window.confirm(
        "Are you sure you want to expire this semester? This will reset all student assignments.",
      )
    ) {
      return;
    }

    try {
      setUpdateLoading(true);
      const res = await fetchData(`/semester/${currentSemester._id}/expire`, {
        method: "PATCH",
      });

      if (res?.data) {
        setCurrentSemester(null);
        setPreviousSemesters([res.data, ...previousSemesters]);
      }
    } catch (error) {
      console.error("Error expiring semester:", error);
    } finally {
      setUpdateLoading(false);
    }
  };

  const canAddSemester = !currentSemester;

  return (
    <>
      <header className="flex justify-between px-5 pt-5 items-center">
        <div className="flex flex-col">
          <h1 className="font-bold text-3xl">Semester Management</h1>
          <p className="text-gray-400">
            View and manage semester details and reports.
          </p>
        </div>
        {/* Quick Actions */}
        <div className="flex gap-5">
          {canAddSemester && (
            <Link
              to="/semesters/add"
              className="flex items-center gap-2 py-2 px-4 rounded-md bg-violet-500 text-white hover:bg-violet-600 transition-colors"
            >
              <CirclePlus strokeWidth={1.5} />
              <span>Add Semester</span>
            </Link>
          )}
          {currentSemester && (
            <button
              onClick={handleExpireSemester}
              disabled={updateLoading}
              className="flex items-center gap-2 py-2 px-4 rounded-md bg-red-500 text-white hover:bg-red-600 transition-colors disabled:opacity-50"
            >
              <span>Expire Semester</span>
            </button>
          )}
        </div>
      </header>

      {/* Statistics */}
      <div className="flex gap-5 h-[150px] px-5">
        <ReportSummaryCard loading={loadingStats} stats={stats} />
      </div>

      {/* Current Semester */}
      <div className="mx-5 mb-5">
        <CurrentSemesterCard
          semester={currentSemester}
          onUpdateName={handleUpdateSemesterName}
          isLoading={updateLoading}
        />
      </div>

      {/* Previous Semesters */}
      <div className="mx-5 p-5 rounded-lg bg-white border border-gray-200 shadow-sm">
        <header className="flex w-full items-center justify-between mb-4">
          <h1 className="font-semibold text-base text-gray-700">
            Previous Semesters
          </h1>
        </header>
        <PreviousSemestersTable
          semesters={previousSemesters}
          isLoading={loading}
        />
      </div>
    </>
  );
}
