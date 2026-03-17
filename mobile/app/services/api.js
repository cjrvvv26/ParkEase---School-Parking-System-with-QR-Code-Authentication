import axios from 'axios';

export const BASE_URL = 'http://192.168.1.4:5000';

export default axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});
