import { apiSlice } from '../api-slice';
import type { Profile } from '@/models/profile';

export const profileApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getProfile: builder.query<{ message: string; data: Profile }, void>({
            query: () => `/api/private/users`,
            providesTags: ['Profile'],
        }),
        updateProfile: builder.mutation<{ message: string; data: Profile }, Partial<Profile>>({
            query: (body) => ({
                url: `/api/private/users`,
                method: 'PUT',
                body,
            }),
            invalidatesTags: ['Profile'],
        }),
    }),
});

export const { useGetProfileQuery, useUpdateProfileMutation } = profileApi;
