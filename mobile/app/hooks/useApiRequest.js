import { useState } from 'react';

export default function useApiRequest() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = async (apiCall, payload = {}) => {
    setLoading(true);
    setError(null);
    try {
      console.log('[API REQUEST] Payload:', payload);

      const response = await apiCall(payload);
      console.log('[API SUCCESS]', response?.status, response?.data);

      if (response) return response;
    } catch (error) {
      console.log('[API ERROR] Full error object:', error);
      console.log('[API ERROR] Message:', error.message);
      console.log('[API ERROR] Code:', error.code);
      console.log('[API ERROR] Response status:', error.response?.status);
      console.log('[API ERROR] Response data:', error.response?.data);
      console.log(
        '[API ERROR] Config:',
        error.config?.url,
        error.config?.baseURL,
      );

      const errorMessage =
        error.response?.data?.error ||
        error.message ||
        'Network connection failed';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, setError, execute };
}
