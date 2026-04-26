import axios, { AxiosError, type AxiosResponse } from 'axios';
import { clearData } from '@/app/lib/store/auth-slice/auth-slice';
import { store } from '@/app/lib/store';

const API = axios.create({
    baseURL: '/',
    headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
        Pragma: 'no-cache',
        Expires: '0',
    },
});

API.interceptors.request.use(
    async function (config) {
        const state = store?.getState();
        const accessToken = state.auth.accessToken;
        if (accessToken) {
            config.headers.Authorization = 'Bearer ' + accessToken;
        }
        return config;
    },
    function (error) {
        return Promise.reject(error);
    }
);

API.interceptors.response.use(
    function (config: AxiosResponse) {
        return config.data;
    },
    function (error: AxiosError) {
        const code = error.response?.status as number;
        if ([401].includes(code)) {
            store?.dispatch(clearData());
        }
        return Promise.reject(error);
    }
);

export default API;
