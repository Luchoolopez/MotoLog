import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'http://localhost:3000/api', 
    headers: {
        'Content-Type': 'application/json'
    }
});

apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            
            localStorage.removeItem('accessToken');
            localStorage.removeItem('user');


            if (window.location.pathname !== '/iniciar-sesion') {
                window.location.href = '/iniciar-sesion';
            }
        }
        return Promise.reject(error);
    }
);

export default apiClient;