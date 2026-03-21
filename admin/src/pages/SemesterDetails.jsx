import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import useDark from "../hooks/useDark";
import { ArrowLeft, Info, Calendar, DollarSign, CheckCircle } from "lucide-react";

export default function SemesterDetails() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { fetchData } = useFetch();
  const { dark, border } = useDark();
  const [semester, setSemester] = useState(location.state?.semester || null);
  const [loading, setLoading] = useState(!semester);

  useEffect(() => {
    if (!semester) {
      const fetchSemesterDetails = async () => {
        try {
          setLoading(true);
          const res = await fetchData(`/semester/${id}`);
          if (res?.data) {
            setSemester(res.data);
          }
        } catch (error) {
          console.error("Error fetching semester details:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchSemesterDetails();
    }
  }, [id, semester, fetchData]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const calculateDuration = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = end - start;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const months = Math.floor(diffDays / 30);
    return months > 0 ? `${months} months` : `${diffDays} days`;
  };

  if (loading) {
    return (
      <div className="min-h-screen py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-10 bg-gray-200 rounded w-48"></div>
            <div className="h-40 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!semester) {
    return (
      <div className="min-h-screen py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <button onClick={() => navigate("/semesters")} className="flex items-center gap-2 text-violet-500 hover:text-violet-600 mb-4">
            <ArrowLeft size={18} /><span>Back to Semesters</span>
          </button>
          <div className={`rounded-lg p-8 text-center ${dark ? 'bg-[#2f2f2f]' : 'bg-white'}`}>
            <p className="text-gray-500">Semester not found</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-5">
      <div className="mx-5">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate("/semesters")}
            className="flex items-center gap-2 text-violet-500 hover:text-violet-600 mb-4"
          >
            <ArrowLeft size={18} />
            <span>Back to Semesters</span>
          </button>
          <h1 className={`text-3xl font-bold ${dark ? 'text-gray-100' : 'text-gray-800'}`}>{semester.name}</h1>
          <p className="text-gray-500 mt-2">Semester Details & Statistics</p>
        </div>

        <div className={`rounded-lg p-8 mb-6 border ${border} ${dark ? 'bg-[#2f2f2f]' : 'bg-white'}`}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <Calendar size={20} className="text-violet-500" />
                  <h3 className={`font-semibold ${dark ? 'text-gray-200' : 'text-gray-700'}`}>Duration</h3>
                </div>
                <div className="ml-8 space-y-2">
                  <div><p className="text-xs text-gray-400">Start Date</p><p className={`text-sm font-medium ${dark ? 'text-gray-200' : 'text-gray-800'}`}>{formatDate(semester.startDate)}</p></div>
                  <div><p className="text-xs text-gray-400">End Date</p><p className={`text-sm font-medium ${dark ? 'text-gray-200' : 'text-gray-800'}`}>{formatDate(semester.endDate)}</p></div>
                  <div><p className="text-xs text-gray-400">Total Duration</p><p className={`text-sm font-medium ${dark ? 'text-gray-200' : 'text-gray-800'}`}>{calculateDuration(semester.startDate, semester.endDate)}</p></div>
                </div>
              </div>
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <CheckCircle size={20} className="text-green-500" />
                  <h3 className={`font-semibold ${dark ? 'text-gray-200' : 'text-gray-700'}`}>Status</h3>
                </div>
                <div className="ml-8">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${semester.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}`}>
                    {semester.status === "active" ? "Active" : "Expired"}
                  </span>
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <DollarSign size={20} className="text-violet-500" />
                  <h3 className={`font-semibold ${dark ? 'text-gray-200' : 'text-gray-700'}`}>Pricing</h3>
                </div>
                <div className="ml-8 space-y-2">
                  <div><p className="text-xs text-gray-400">Slot Price</p><p className={`text-lg font-bold ${dark ? 'text-gray-200' : 'text-gray-800'}`}>₱{semester.slotPrice.toLocaleString()}</p></div>
                  <div><p className="text-xs text-gray-400">Total Revenue</p><p className="text-lg font-bold text-green-600">₱{(semester.revenue || 0).toLocaleString()}</p></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="bg-violet-100 border border-violet-500 inline-block text-violet-500 rounded-lg p-4">
          <p className="text-sm text-violet-500 flex items-center gap-2">
            <div className="flex items-center gap-1 font-semibold">
              <Info className="size-5" />
              <span>Note:</span>
            </div>{" "}
            This semester{" "}
            {semester.status === "active"
              ? "is currently active. Students can pay and book slots for this semester."
              : "has expired. All student assignments have been reset for the new semester."}
          </p>
        </div>
      </div>
    </div>
  );
}
