import axios from 'axios';

export const BASE_URL = 'http://192.168.0.101:5000';

export default axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});
