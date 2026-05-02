import { apiSlice } from '../api-slice';
import type { LoginPayload, Login } from '@/models/auth';

export const authApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        generateDefaultUser: builder.query<boolean, void>({
            query: () => `/api/public/seed/default-user`,
        }),
        login: builder.mutation<{ message: string; data: Login }, LoginPayload>({
            query: (payload) => ({
                url: `/api/public/auth/login`,
                method: 'POST',
                body: payload,
            }),
        }),
        logout: builder.query<{ data: any }, void>({
            query: () => `/api/public/auth/logout`,
        }),
    }),
});

export const { useGenerateDefaultUserQuery, useLoginMutation, useLazyLogoutQuery } = authApi;
