import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector, useStore } from 'react-redux';

import authReducer from './auth-slice/auth-slice';
import uiReducer from './ui-slice/ui-slice';
import profileReducer from './profile-slice/profile-slice';
import { injectStore } from '@/utils/api-helper';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        ui: uiReducer,
        profile: profileReducer,
    },
    // middleware: (getDefaultMiddleware) =>
    // getDefaultMiddleware().concat(profileReducer.middleware),
});

injectStore(store);

export type AppStore = typeof store;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
export const useAppStore = useStore.withTypes<AppStore>();
