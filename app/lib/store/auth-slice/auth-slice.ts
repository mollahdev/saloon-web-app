import { createSlice } from '@reduxjs/toolkit';
import type { RootState } from '@/app/lib/store';
import { generateDefaultUserAction } from './auth-action';

const initialState = {
    accessToken: '',
    isDefaultUserGenerated: false,
    status: 'idle',
    error: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        clearData: (state) => {
            state.status = 'idle';
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(generateDefaultUserAction.pending, (state) => {
            state.status = 'loading';
        });
        builder.addCase(generateDefaultUserAction.fulfilled, (state) => {
            state.status = 'succeeded';
            state.isDefaultUserGenerated = true;
        });
        builder.addCase(generateDefaultUserAction.rejected, (state) => {
            state.status = 'failed';
            state.isDefaultUserGenerated = false;
        });
    },
});

export const selectAccessToken = (state: RootState) => state.auth.accessToken;

export const selectisDefaultUserGenerated = (state: RootState) => state.auth.isDefaultUserGenerated;

export const { clearData } = authSlice.actions;
export default authSlice.reducer;
