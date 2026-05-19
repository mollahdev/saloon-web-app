import { apiSlice } from '../api-slice';
import { ScheduleValues } from '@/app/lib/validation/schedule';

export const scheduleApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getSchedule: builder.query<
            { message: string; data: { schedule: ScheduleValues['schedule'] } },
            void
        >({
            query: () => `/api/private/schedule`,
            providesTags: ['Schedule'],
        }),
        getBusinessTimeOff: builder.query<{ message: string; data: any[] }, void>({
            query: () => `/api/private/schedule/time-off`,
            providesTags: ['TimeOff'],
        }),
        updateSchedule: builder.mutation<{ message: string; data: any }, ScheduleValues>({
            query: (body) => ({
                url: `/api/private/schedule`,
                method: 'PUT',
                body,
            }),
            invalidatesTags: ['Schedule'],
        }),
        createBusinessTimeOff: builder.mutation<{ message: string; data: any }, any>({
            query: (body) => ({
                url: `/api/private/schedule/time-off`,
                method: 'POST',
                body,
            }),
            invalidatesTags: ['TimeOff'],
        }),
        updateBusinessTimeOff: builder.mutation<
            { message: string; data: any },
            { id: string; body: any }
        >({
            query: ({ id, body }) => ({
                url: `/api/private/schedule/time-off/${id}`,
                method: 'PUT',
                body,
            }),
            invalidatesTags: ['TimeOff'],
        }),
        deleteBusinessTimeOff: builder.mutation<{ message: string }, string>({
            query: (id) => ({
                url: `/api/private/schedule/time-off/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['TimeOff'],
        }),
    }),
});

export const {
    useGetScheduleQuery,
    useGetBusinessTimeOffQuery,
    useUpdateScheduleMutation,
    useCreateBusinessTimeOffMutation,
    useUpdateBusinessTimeOffMutation,
    useDeleteBusinessTimeOffMutation,
} = scheduleApi;
