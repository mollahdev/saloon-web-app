'use client';

import { useAppDispatch } from '@/app/lib/store';
import {
    setConfirmation,
    closeConfirmation,
    setConfirmationLoading,
} from '@/app/lib/store/ui/slice';

interface ConfirmationOptions {
    title?: string;
    message?: string;
    confirmLabel?: string;
    cancelLabel?: string;
    color?: string;
    onConfirm: () => void | Promise<void>;
    onCancel?: () => void;
}

// Module-level storage for non-serializable callbacks
// Since only one confirmation can be open at a time, this is safe
let confirmCallback: (() => void | Promise<void>) | null = null;
let cancelCallback: (() => void) | null = null;

export const useConfirmation = () => {
    const dispatch = useAppDispatch();

    const confirm = (options: ConfirmationOptions) => {
        const { onConfirm, onCancel, ...serializableOptions } = options;

        confirmCallback = onConfirm;
        cancelCallback = onCancel || null;

        dispatch(setConfirmation(serializableOptions));
    };

    return { confirm };
};

// Internal handlers to be used by the GlobalConfirmationModal component
export const _handleGlobalConfirm = async (dispatch: any) => {
    if (confirmCallback) {
        dispatch(setConfirmationLoading(true));
        try {
            await confirmCallback();
            dispatch(closeConfirmation());
            confirmCallback = null;
            cancelCallback = null;
        } catch (error) {
            console.error('Confirmation error:', error);
            dispatch(setConfirmationLoading(false));
        }
    } else {
        dispatch(closeConfirmation());
    }
};

export const _handleGlobalCancel = (dispatch: any) => {
    if (cancelCallback) {
        cancelCallback();
    }
    dispatch(closeConfirmation());
    confirmCallback = null;
    cancelCallback = null;
};
