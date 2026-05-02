import { createSlice } from '@reduxjs/toolkit';
import type { RootState } from '@/app/lib/store';
import type { PayloadAction } from '@reduxjs/toolkit';
import { authApi } from './api';

const initialState = {
    accessToken: '',
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        clearData: (state) => {
            state.accessToken = '';
        },
        setAccessToken: (state, action: PayloadAction<string>) => {
            state.accessToken = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder.addMatcher(authApi.endpoints.login.matchFulfilled, (state, { payload }) => {
            state.accessToken = payload.data.accessToken;
        });
        builder.addMatcher(authApi.endpoints.logout.matchFulfilled, (state) => {
            state.accessToken = '';
        });
        builder.addMatcher(authApi.endpoints.logout.matchRejected, (state) => {
            state.accessToken = '';
        });
        builder.addMatcher(authApi.endpoints.generateDefaultUser.matchRejected, (state) => {
            state.accessToken = '';
        });
    },
});

export const selectAccessToken = (state: RootState) => state.auth.accessToken;

export const { clearData, setAccessToken } = authSlice.actions;
export default authSlice.reducer;
