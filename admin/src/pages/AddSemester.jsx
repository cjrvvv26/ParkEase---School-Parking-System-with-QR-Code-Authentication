import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import { ArrowLeft } from "lucide-react";
import useDark from "../hooks/useDark";

export default function AddSemester() {
  const navigate = useNavigate();
  const { fetchData } = useFetch();
  const { dark, border, input } = useDark();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    startDate: "",
    endDate: "",
    slotPrice: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError("Semester name is required");
      return false;
    }
    if (!formData.startDate) {
      setError("Start date is required");
      return false;
    }
    if (!formData.endDate) {
      setError("End date is required");
      return false;
    }
    if (!formData.slotPrice || formData.slotPrice <= 0) {
      setError("Slot price must be greater than 0");
      return false;
    }

    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    if (end <= start) {
      setError("End date must be after start date");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) return;

    setLoading(true);

    try {
      console.log("Submitting semester data:", {
        name: formData.name,
        startDate: formData.startDate,
        endDate: formData.endDate,
        slotPrice: Number(formData.slotPrice),
      });

      const res = await fetchData("/semester", {
        method: "POST",
        data: {
          name: formData.name,
          startDate: formData.startDate,
          endDate: formData.endDate,
          slotPrice: Number(formData.slotPrice),
        },
      });

      console.log("Response received:", res);

      // Check if response is valid
      if (!res) {
        throw new Error("No response from server");
      }

      // If we got here, the request was successful
      navigate("/semesters", {
        state: {
          message: "Semester created successfully!",
          type: "success",
        },
      });
    } catch (err) {
      console.error("Error caught:", err);
      console.error("Error details:", {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
      });

      const errorMsg =
        err.response?.data?.error || err.message || "Failed to create semester";

      setError(errorMsg);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <button onClick={() => navigate("/semesters")} className="flex items-center gap-2 text-violet-500 hover:text-violet-600 mb-4">
            <ArrowLeft size={18} />
            <span>Back to Semesters</span>
          </button>
          <h1 className={`text-3xl font-bold ${dark ? 'text-gray-100' : 'text-gray-800'}`}>Add New Semester</h1>
          <p className="text-gray-500 mt-2">Create a new semester with start and end dates</p>
        </div>

        <div className={`rounded-lg border shadow-sm p-8 ${dark ? 'bg-[#2f2f2f] border-[#3a3a3a]' : 'bg-white border-gray-200'}`}>
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm font-medium">{error}</p>
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className={`block text-sm font-medium mb-2 ${dark ? 'text-gray-300' : 'text-gray-700'}`}>Semester Name <span className="text-red-500">*</span></label>
              <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} placeholder="e.g., 1st Sem 2026" className={`w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent ${input}`} />
              <p className="text-gray-500 text-xs mt-1">Enter a descriptive name for this semester</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="startDate" className={`block text-sm font-medium mb-2 ${dark ? 'text-gray-300' : 'text-gray-700'}`}>Start Date <span className="text-red-500">*</span></label>
                <input type="date" id="startDate" name="startDate" value={formData.startDate} onChange={handleChange} className={`w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent ${input}`} />
              </div>
              <div>
                <label htmlFor="endDate" className={`block text-sm font-medium mb-2 ${dark ? 'text-gray-300' : 'text-gray-700'}`}>End Date <span className="text-red-500">*</span></label>
                <input type="date" id="endDate" name="endDate" value={formData.endDate} onChange={handleChange} className={`w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent ${input}`} />
              </div>
            </div>
            <div>
              <label htmlFor="slotPrice" className={`block text-sm font-medium mb-2 ${dark ? 'text-gray-300' : 'text-gray-700'}`}>Slot Price (₱) <span className="text-red-500">*</span></label>
              <input type="number" id="slotPrice" name="slotPrice" value={formData.slotPrice} onChange={handleChange} placeholder="0.00" step="0.01" min="0" className={`w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent ${input}`} />
              <p className="text-gray-500 text-xs mt-1">Price per parking slot for this semester</p>
            </div>
            {formData.name && formData.startDate && formData.endDate && (
              <div className="p-4 bg-violet-50 rounded-lg border border-violet-200">
                <p className="text-sm text-gray-700">
                  <span className="font-medium">Summary:</span> You are creating a semester named <strong>{formData.name}</strong> from <strong>{new Date(formData.startDate).toLocaleDateString()}</strong> to <strong>{new Date(formData.endDate).toLocaleDateString()}</strong> with a slot price of <strong>₱{formData.slotPrice}</strong>.
                </p>
              </div>
            )}
            <div className="flex gap-4 pt-4">
              <button type="button" onClick={() => navigate("/semesters")} className={`flex-1 px-4 py-2 border font-medium rounded-lg transition-colors ${dark ? 'border-[#4a4a4a] text-gray-300 hover:bg-[#3a3a3a]' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}>Cancel</button>
              <button type="submit" disabled={loading} className="flex-1 px-4 py-2 bg-violet-500 text-white font-medium rounded-lg hover:bg-violet-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">{loading ? "Creating..." : "Create Semester"}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
