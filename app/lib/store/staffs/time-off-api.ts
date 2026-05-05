import { apiSlice } from '../api-slice';
import { TimeOffFormValues } from '@/app/lib/validation/time-off';

export interface TimeOffEntry {
    id: string;
    userId: string;
    type: 'SINGLE' | 'BREAK' | 'RECURRING';
    title: string;
    isFullDay: boolean;
    startDate: string;
    endDate: string | null;
    startTime: string | null;
    endTime: string | null;
    repeatType: 'DAILY' | 'WEEKLY' | 'MONTHLY' | null;
    repeatDay: number | null;
    createdAt: string;
    updatedAt: string;
}

export const timeOffApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getTimeOffs: builder.query<{ message: string; data: TimeOffEntry[] }, string>({
            query: (staffId) => `/api/private/staffs/${staffId}/time-off`,
            providesTags: (_result, _err, staffId) => [{ type: 'TimeOff', id: staffId }],
        }),
        createTimeOff: builder.mutation<
            { message: string; data: TimeOffEntry },
            { staffId: string; body: TimeOffFormValues }
        >({
            query: ({ staffId, body }) => ({
                url: `/api/private/staffs/${staffId}/time-off`,
                method: 'POST',
                body,
            }),
            invalidatesTags: (_result, _err, { staffId }) => [{ type: 'TimeOff', id: staffId }],
        }),
        deleteTimeOff: builder.mutation<
            { message: string; data: null },
            { staffId: string; timeOffId: string }
        >({
            query: ({ staffId, timeOffId }) => ({
                url: `/api/private/staffs/${staffId}/time-off/${timeOffId}`,
                method: 'DELETE',
            }),
            invalidatesTags: (_result, _err, { staffId }) => [{ type: 'TimeOff', id: staffId }],
        }),
    }),
});

export const { useGetTimeOffsQuery, useCreateTimeOffMutation, useDeleteTimeOffMutation } =
    timeOffApi;
