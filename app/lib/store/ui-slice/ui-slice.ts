import { createSlice } from '@reduxjs/toolkit';
import type { RootState } from '@/app/lib/store';
import type { PayloadAction } from '@reduxjs/toolkit';

// Initialize with safe server-side values to avoid hydration mismatch
const initialState = {
    device: 'desktop' as 'mobile' | 'tablet' | 'desktop',
    sidebarExpanded: true,
};

const uiSlice = createSlice({
    name: 'ui',
    initialState,
    reducers: {
        setDevice: (state, action: PayloadAction<'mobile' | 'tablet' | 'desktop'>) => {
            state.device = action.payload;
        },
        setSidebarExpanded: (state, action: PayloadAction<boolean>) => {
            state.sidebarExpanded = action.payload;
        },
    },
});

export const selectDevice = (state: RootState) => state.ui.device;
export const selectSidebarExpanded = (state: RootState) => state.ui.sidebarExpanded;

export const { setDevice, setSidebarExpanded } = uiSlice.actions;
export default uiSlice.reducer;
