import axios, { AxiosError, type AxiosResponse } from 'axios';
import toast from 'react-hot-toast';

let store: any;

export const injectStore = (_store: any) => {
    store = _store;
};

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
        const accessToken = state?.auth.accessToken;
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
            store?.dispatch({ type: 'auth/clearData' });
        } else {
            const errorData = error.response?.data as any;
            const errorMessage =
                errorData?.message || error.message || 'An unexpected error occurred';
            toast.error(errorMessage);
        }
        return Promise.reject(error);
    }
);

export default API;
