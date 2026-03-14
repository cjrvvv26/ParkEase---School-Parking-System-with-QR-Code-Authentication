import axios from 'axios';

export default axios.create({
  baseURL: 'http://192.168.1.4:5000',
  timeout: 10000,
});
