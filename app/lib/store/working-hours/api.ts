import { apiSlice } from '../api-slice';
import { WorkingHoursValues } from '@/app/lib/validation/working-hours';

export const workingHoursApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getWorkingHours: builder.query<{ message: string; data: WorkingHoursValues }, void>({
            query: () => `/api/private/working-hours`,
            providesTags: ['WorkingHours'],
        }),
        updateWorkingHours: builder.mutation<{ message: string; data: any }, WorkingHoursValues>({
            query: (body) => ({
                url: `/api/private/working-hours`,
                method: 'PUT',
                body,
            }),
            invalidatesTags: ['WorkingHours'],
        }),
    }),
});

export const { useGetWorkingHoursQuery, useUpdateWorkingHoursMutation } = workingHoursApi;
