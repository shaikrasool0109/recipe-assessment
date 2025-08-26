import axios from 'axios';

const client = axios.create({
  baseURL: '/api',
  timeout: 10000,
});

export default client;
