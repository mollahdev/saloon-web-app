import { createSlice } from '@reduxjs/toolkit';
import { fetchProfileAction } from './profile-action';
import type { RootState } from '@/app/lib/store';

const initialState = {
    profile: null,
    status: 'idle',
    error: null,
};

const profileSlice = createSlice({
    name: 'profile',
    initialState,
    reducers: {
        clearData: (state) => {
            state.profile = null;
            state.status = 'idle';
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchProfileAction.pending, (state) => {
            state.status = 'loading';
        });
        builder.addCase(fetchProfileAction.fulfilled, (state, action: any) => {
            state.status = 'succeeded';
            state.profile = action.payload;
        });
        builder.addCase(fetchProfileAction.rejected, (state) => {
            state.status = 'failed';
            state.profile = null;
        });
    },
});

export const selectProfile = (state: RootState) => state.profile.profile;

export const { clearData } = profileSlice.actions;
export default profileSlice.reducer;
