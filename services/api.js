// services/api.js
import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';
import { getToken } from '../utils/authStorage';

const api = axios.create({
  baseURL: API_BASE_URL,
});


api.interceptors.request.use(
  async (config) => {
    const token = await getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;