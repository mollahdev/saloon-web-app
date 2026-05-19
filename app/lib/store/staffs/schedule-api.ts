import { apiSlice } from '../api-slice';
import { ScheduleValues } from '@/app/lib/validation/schedule';

interface StaffScheduleResponse {
    message: string;
    data: {
        staff: {
            id: string;
            name: string;
            avatar: string | null;
            position: string | null;
        };
        schedule: ScheduleValues['schedule'];
    };
}

export const staffScheduleApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getStaffSchedule: builder.query<StaffScheduleResponse, string>({
            query: (staffId) => `/api/private/staffs/${staffId}/schedule`,
            providesTags: (_result, _err, staffId) => [{ type: 'Schedule', id: staffId }],
        }),
        updateStaffSchedule: builder.mutation<
            { message: string; data: any },
            { staffId: string; body: ScheduleValues }
        >({
            query: ({ staffId, body }) => ({
                url: `/api/private/staffs/${staffId}/schedule`,
                method: 'PUT',
                body,
            }),
            invalidatesTags: (_result, _err, { staffId }) => [{ type: 'Schedule', id: staffId }],
        }),
    }),
});

export const { useGetStaffScheduleQuery, useUpdateStaffScheduleMutation } = staffScheduleApi;
