import { apiSlice } from '../api-slice';
import type { Profile } from '@/models/profile';

export const profileApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getProfile: builder.query<{ message: string; data: Profile }, void>({
            query: () => `/api/private/users`,
            providesTags: ['Profile'],
        }),
    }),
});

export const { useGetProfileQuery } = profileApi;
