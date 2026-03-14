import { useState } from 'react';

export default function useApiRequest() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = async (apiCall, payload = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiCall(payload);
      return response;
    } catch (error) {
      setError(error.response.data?.error);
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, setError, execute };
}
