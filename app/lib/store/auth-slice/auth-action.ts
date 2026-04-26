import { createAsyncThunk } from '@reduxjs/toolkit';
import { generateDefaultUser } from './auth-api';

export const generateDefaultUserAction = createAsyncThunk('auth/seed/default-user', async () => {
    try {
        await generateDefaultUser();
        return true;
    } catch {
        return false;
    }
});
