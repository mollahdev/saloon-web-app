import { createAsyncThunk } from '@reduxjs/toolkit';
import type { AxiosError } from 'axios';
import toast from 'react-hot-toast';

/**
 * Internal dependencies
 */
import { getGenerateDefaultUserApi, getLoginApi } from './auth-api';
import type { LoginPayload } from '@/models/auth';
import type { KnownError } from '@/models';

export const generateDefaultUserAction = createAsyncThunk(
    'auth/seed/default-user',
    async (_, { rejectWithValue }) => {
        try {
            await getGenerateDefaultUserApi();
            return true;
        } catch (err) {
            const error: AxiosError<KnownError> = err as any;
            if (!error.response) {
                throw err;
            }
            return rejectWithValue(error.response.data.message);
        }
    }
);

export const loginAction = createAsyncThunk(
    'auth/login',
    async (payload: LoginPayload, { rejectWithValue }) => {
        try {
            const response = await getLoginApi(payload);
            return response.data;
        } catch (err) {
            const error: AxiosError<KnownError> = err as any;
            if (!error.response) {
                throw err;
            }

            toast.error(error.response.data.message);
            return rejectWithValue(error.response.data.message);
        }
    }
);
