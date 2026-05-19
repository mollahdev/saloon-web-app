import { apiSlice } from '../api-slice';
import { ScheduleValues } from '@/app/lib/validation/schedule';

export const scheduleApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getSchedule: builder.query<{ message: string; data: ScheduleValues }, void>({
            query: () => `/api/private/schedule`,
            providesTags: ['Schedule'],
        }),
        updateSchedule: builder.mutation<{ message: string; data: any }, ScheduleValues>({
            query: (body) => ({
                url: `/api/private/schedule`,
                method: 'PUT',
                body,
            }),
            invalidatesTags: ['Schedule'],
        }),
    }),
});

export const { useGetScheduleQuery, useUpdateScheduleMutation } = scheduleApi;
