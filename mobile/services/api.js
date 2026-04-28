import axios from 'axios';
import { Platform } from 'react-native';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LOCAL_BASE_URL =
  Platform.OS === 'android'
    ? 'https://parkease-school-parking-system-with-qr-nn18.onrender.com'
    : 'http://localhost:5000';

export const BASE_URL =
  Constants.expoConfig?.extra?.API_URL ||
  Constants.manifest?.extra?.API_URL ||
  LOCAL_BASE_URL;

console.log('[API CONFIG] Platform:', Platform.OS);
console.log('[API CONFIG] Base URL:', BASE_URL);

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
});

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  console.log(
    '[API INTERCEPTOR] Request to:',
    config.url,
    'Full URL:',
    `${config.baseURL}${config.url}`,
  );
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log('[API INTERCEPTOR ERROR]', {
      message: error.message,
      code: error.code,
      url: error.config?.url,
      baseURL: error.config?.baseURL,
      status: error.response?.status,
    });
    return Promise.reject(error);
  },
);

export default api;
