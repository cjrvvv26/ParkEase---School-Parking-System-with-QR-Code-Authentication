import { useState } from "react";
import axios from "../utils/axiosConfig";

export default function useFetch() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchData = async (url, options = {}) => {
    try {
      console.log("Making request to:", url, "with options:", options);
      const res = await axios({
        url,
        ...options,
      });
      console.log("Response data:", res.data);
      return res.data;
    } catch (err) {
      console.error("Fetch error:", err);
      console.error("Error response:", err.response?.data);
      console.error("Error status:", err.response?.status);
      console.error("Error message:", err.message);

      let errorMsg = "Something went wrong";

      if (err.response?.data?.error) {
        errorMsg = err.response.data.error;
      } else if (err.response?.data?.message) {
        errorMsg = err.response.data.message;
      } else if (err.message) {
        errorMsg = err.message;
      }

      setError(errorMsg);
      throw err;
    }
  };

  return { error, loading, setError, fetchData, setLoading };
}
