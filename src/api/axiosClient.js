import axios from 'axios';
//here we store the base url of the api from our .env
const API_BASE = process.env.REACT_APP_API_URL;

const axiosClient = axios.create({ baseURL: API_BASE });
//before making any request we will attach the token and tenant id if available
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  const tenantId = localStorage.getItem('tenantId');

  if (token) config.headers['Authorization'] = `Bearer ${token}`;
  if (tenantId) config.headers['X-Tenant-ID'] = tenantId;

  return config;
});

export default axiosClient;
