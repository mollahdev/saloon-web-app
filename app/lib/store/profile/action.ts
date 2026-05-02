import { createAsyncThunk } from '@reduxjs/toolkit';
import type { AxiosError } from 'axios';
import toast from 'react-hot-toast';

/**
 * Internal dependencies
 */
import { getProfileApi } from './api';
import type { KnownError } from '@/models';

export const fetchProfileAction = createAsyncThunk(
    'profile/fetchProfile',
    async (_, { rejectWithValue }) => {
        try {
            const response = await getProfileApi();
            return response.data;
        } catch (err: any) {
            const error: AxiosError<KnownError> = err;
            if (!error.response) {
                toast.error(err.message);
                return rejectWithValue(err.message);
            }
            toast.error(error.response.data.message);
            return rejectWithValue(error.response.data.message);
        }
    }
);
