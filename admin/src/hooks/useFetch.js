import { useState } from "react";
import axios from "../utils/axiosConfig";

export default function useFetch() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchData = async (url, options) => {
    try {
      setLoading(true);
      const res = await axios(url, options);
      return res.data;
    } catch (error) {
      console.log(error.response.data);

      if (error.response) {
        setError(error.response.data.error || "Something went wrong");
      } else if (error.request) {
        setError("No response from the server");
      } else {
        setError(error.message);
      }
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { error, loading, setError, fetchData };
}
