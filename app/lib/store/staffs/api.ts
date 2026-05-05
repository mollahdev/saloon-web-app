import { apiSlice } from '../api-slice';
import { ApiResponse } from '@/models';
import { Profile } from '@/models/profile';

export const staffsApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getStaffs: builder.query<ApiResponse<Profile[]>, void>({
            query: () => `/api/private/staffs`,
            providesTags: ['Staffs'],
        }),
        deleteStaff: builder.mutation<ApiResponse<null>, string>({
            query: (id) => ({
                url: `/api/private/staffs/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Staffs'],
        }),
    }),
});

export const { useGetStaffsQuery, useDeleteStaffMutation } = staffsApi;
