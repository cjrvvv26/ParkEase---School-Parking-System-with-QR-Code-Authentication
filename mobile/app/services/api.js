import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const BASE_URL = 'https://your-deployed-server.up.railway.app';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
