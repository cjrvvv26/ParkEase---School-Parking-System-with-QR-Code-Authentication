import axios from "axios";

const axiosConfig = axios.create({
  baseURL: "https://parkease-school-parking-system-with-qr.onrender.com",
  withCredentials: true,
});

export default axiosConfig;
