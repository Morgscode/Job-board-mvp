import axios from 'axios';

const http = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    timeout: 5000,
});

export { http }