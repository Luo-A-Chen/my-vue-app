import axios from 'axios'
import { useUserStore } from './store';

//全局请求拦截器
export const api= axios.create({
    baseURL:'http://localhost:8080',//本地环境
    // baseURL:'/api',//线上代理环境
    // baseURL:'http://47.105.118.0:8080',
    timeout:10000,
    headers:{
        'Content-Type':'application/json'
    }
})

api.interceptors.request.use(
    (config) => {
        const token = useUserStore().token;
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
            if (error.response.status === 401) {
                const userStore = useUserStore();
                userStore.logout();
                if (window.location.pathname !== '/login') {
                    window.location.href = '/login';
                }
            }
        }else{
            console.error('Network Error:', error.message);
        }
        return Promise.reject(error);
    }
);