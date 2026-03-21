import { useState } from 'react';

export default function useApiRequest() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = async (apiCall, payload = {}) => {
    setLoading(true);
    setError(null);
    try {
      console.log(payload);

      const response = await apiCall(payload);
      console.log(response);

      if (response) return response;
    } catch (error) {
      console.log('[API ERROR]', error.message, error.response?.status, JSON.stringify(error.response?.data));
      setError(error.response?.data?.error || error.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, setError, execute };
}
