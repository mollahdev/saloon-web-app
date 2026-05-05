import { apiSlice } from '../api-slice';
import { WorkingHoursValues } from '@/app/lib/validation/working-hours';

interface StaffScheduleResponse {
    message: string;
    data: {
        staff: {
            id: string;
            name: string;
            avatar: string | null;
            position: string | null;
        };
        workingHours: WorkingHoursValues['workingHours'];
    };
}

export const staffScheduleApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getStaffSchedule: builder.query<StaffScheduleResponse, string>({
            query: (staffId) => `/api/private/staffs/${staffId}/schedule`,
            providesTags: (_result, _err, staffId) => [{ type: 'StaffSchedule', id: staffId }],
        }),
        updateStaffSchedule: builder.mutation<
            { message: string; data: any },
            { staffId: string; body: WorkingHoursValues }
        >({
            query: ({ staffId, body }) => ({
                url: `/api/private/staffs/${staffId}/schedule`,
                method: 'PUT',
                body,
            }),
            invalidatesTags: (_result, _err, { staffId }) => [
                { type: 'StaffSchedule', id: staffId },
            ],
        }),
    }),
});

export const { useGetStaffScheduleQuery, useUpdateStaffScheduleMutation } = staffScheduleApi;
