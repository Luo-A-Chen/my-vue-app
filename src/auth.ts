import axios from 'axios'

export const api= axios.create({
    baseURL:'http://localhost:8080',
    timeout:10000,
    headers:{
        'Content-Type':'application/json'
    }
})

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => {
        return response.data;
    },
    (error) => {
        if (error.response) {
            console.error('API Error:', error.response.status, error.response.data);
        }else{
            console.error('Network Error:', error.message);
        }
        return Promise.reject(error);
    }
);