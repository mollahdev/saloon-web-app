import { apiSlice } from '../api-slice';
import { ApiResponse } from '@/models';
import { Profile } from '@/models/profile';

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
        getStaffSchedule: builder.query<ApiResponse<{ staff: any; workingHours: any[] }>, string>({
            query: (id) => `/api/private/staffs/${id}/schedule`,
            providesTags: ['Staffs'],
        }),
        getStaffTimeOff: builder.query<ApiResponse<any[]>, string>({
            query: (id) => `/api/private/staffs/${id}/time-off`,
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
} = staffsApi;
