import axios from 'axios';

const axiosConfig = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ||
    'https://parkease-school-parking-system-with-qr-nn18.onrender.com/',
  withCredentials: true,
  timeout: 60000,
});

export default axiosConfig;
