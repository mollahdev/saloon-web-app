import { apiSlice } from '../api-slice';
import { ApiResponse } from '@/models';
import { Profile } from '@/models/profile';
import { ScheduleValues } from '@/app/lib/validation/schedule';

export const staffsApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getStaffs: builder.query<ApiResponse<Profile[]>, void>({
            query: () => `/api/private/staffs`,
            providesTags: ['Staffs'],
        }),
        getStaff: builder.query<ApiResponse<Profile>, string>({
            query: (id) => `/api/private/staffs/${id}`,
            providesTags: ['Staffs'],
        }),
        getStaffSchedule: builder.query<any, string>({
            query: (id) => `/api/private/schedule/staffs/${id}`,
            transformResponse: (
                response: ApiResponse<{ staff: any; workingHours: any[]; schedule?: any[] }>
            ) => {
                if (response?.data) {
                    const workingHours = response.data.workingHours || response.data.schedule || [];
                    return {
                        ...response,
                        data: {
                            ...response.data,
                            workingHours,
                            schedule: workingHours,
                        },
                    };
                }
                return response;
            },
            providesTags: ['Staffs'],
        }),
        getStaffTimeOff: builder.query<ApiResponse<any[]>, string>({
            query: (id) => `/api/private/schedule/staffs/${id}/time-off`,
            providesTags: ['Staffs'],
        }),
        deleteStaff: builder.mutation<ApiResponse<null>, string>({
            query: (id) => ({
                url: `/api/private/staffs/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Staffs'],
        }),
        createStaff: builder.mutation<ApiResponse<Profile>, Partial<Profile>>({
            query: (body) => ({
                url: `/api/private/staffs`,
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Staffs'],
        }),
        updateStaff: builder.mutation<ApiResponse<Profile>, { id: string; body: any }>({
            query: ({ id, body }) => ({
                url: `/api/private/staffs/${id}`,
                method: 'PUT',
                body,
            }),
            invalidatesTags: ['Staffs'],
        }),
        sendResetPasswordLink: builder.mutation<ApiResponse<null>, string>({
            query: (id) => ({
                url: `/api/private/staffs/${id}/reset-password`,
                method: 'POST',
            }),
        }),
        updateStaffSchedule: builder.mutation<
            ApiResponse<any>,
            { staffId: string; body: ScheduleValues }
        >({
            query: ({ staffId, body }) => ({
                url: `/api/private/schedule/staffs/${staffId}`,
                method: 'PUT',
                body,
            }),
            invalidatesTags: ['Staffs'],
        }),
    }),
});

export const {
    useGetStaffsQuery,
    useGetStaffQuery,
    useGetStaffScheduleQuery,
    useGetStaffTimeOffQuery,
    useDeleteStaffMutation,
    useCreateStaffMutation,
    useUpdateStaffMutation,
    useSendResetPasswordLinkMutation,
    useUpdateStaffScheduleMutation,
} = staffsApi;
