import { createSlice } from '@reduxjs/toolkit';
import type { RootState } from '@/app/lib/store';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface ConfirmationState {
    opened: boolean;
    title: string;
    message: string;
    confirmLabel: string;
    cancelLabel: string;
    color: string;
    loading: boolean;
}

// Initialize with safe server-side values to avoid hydration mismatch
const initialState = {
    device: 'desktop' as 'mobile' | 'tablet' | 'desktop',
    sidebarExpanded: true,
    confirmation: {
        opened: false,
        title: 'Confirm Action',
        message: 'Are you sure?',
        confirmLabel: 'Confirm',
        cancelLabel: 'Cancel',
        color: 'red',
        loading: false,
    } as ConfirmationState,
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
        setConfirmation: (state, action: PayloadAction<Partial<ConfirmationState>>) => {
            state.confirmation = { ...state.confirmation, ...action.payload, opened: true };
        },
        closeConfirmation: (state) => {
            state.confirmation.opened = false;
            state.confirmation.loading = false;
        },
        setConfirmationLoading: (state, action: PayloadAction<boolean>) => {
            state.confirmation.loading = action.payload;
        },
    },
});

export const selectDevice = (state: RootState) => state.ui.device;
export const selectSidebarExpanded = (state: RootState) => state.ui.sidebarExpanded;
export const selectConfirmation = (state: RootState) => state.ui.confirmation;

export const {
    setDevice,
    setSidebarExpanded,
    setConfirmation,
    closeConfirmation,
    setConfirmationLoading,
} = uiSlice.actions;
export default uiSlice.reducer;
