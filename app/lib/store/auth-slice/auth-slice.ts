import { createSlice } from '@reduxjs/toolkit';
import type { RootState } from '@/app/lib/store';
import { generateDefaultUserAction, loginAction } from './auth-action';
import type { Login } from '@/models/auth';
import type { PayloadAction } from '@reduxjs/toolkit';

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
        builder.addCase(generateDefaultUserAction.fulfilled, (state, action: any) => {
            state.status = 'succeeded';
            state.isDefaultUserGenerated = action.payload;
        });
        builder.addCase(generateDefaultUserAction.rejected, (state) => {
            state.status = 'failed';
            state.isDefaultUserGenerated = false;
        });
        builder.addCase(loginAction.pending, (state) => {
            state.status = 'loading';
        });
        builder.addCase(loginAction.fulfilled, (state, action: PayloadAction<Login>) => {
            state.status = 'succeeded';
            state.accessToken = action.payload.accessToken;
        });
        builder.addCase(loginAction.rejected, (state) => {
            state.status = 'failed';
            state.accessToken = '';
        });
    },
});

export const selectAccessToken = (state: RootState) => state.auth.accessToken;

export const selectisDefaultUserGenerated = (state: RootState) => state.auth.isDefaultUserGenerated;

export const { clearData } = authSlice.actions;
export default authSlice.reducer;
