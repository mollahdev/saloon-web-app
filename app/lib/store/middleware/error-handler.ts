import { isRejectedWithValue } from '@reduxjs/toolkit';
import type { Middleware } from '@reduxjs/toolkit';
import toast from 'react-hot-toast';

/**
 * Global RTK Query error handler middleware.
 * Shows a toast notification for any rejected API request.
 */
export const rtkErrorMiddleware: Middleware = () => (next) => (action) => {
    if (isRejectedWithValue(action)) {
        const errorData = action.payload as any;

        // Extract error message from common RTK Query error structures
        const errorMessage =
            errorData?.data?.message || errorData?.message || 'An unexpected error occurred';

        // Avoid showing toasts for 401 errors if they are handled globally (e.g., redirect to login)
        if (errorData?.status !== 401) {
            toast.error(errorMessage);
        }
    }

    return next(action);
};
