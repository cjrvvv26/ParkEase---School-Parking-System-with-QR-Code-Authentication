import axios from 'axios';

const axiosConfig = axios.create({
  baseURL: 'http://localhost:5000',
  withCredentials: true,
  timeout: 60000,
});

export default axiosConfig;
