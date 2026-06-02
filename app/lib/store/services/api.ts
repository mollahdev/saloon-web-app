import { apiSlice } from '../api-slice';
import { ApiResponse } from '@/models';
import { Service } from '@/models/service';
import { ServiceValues } from '@/app/lib/validation/service';

export const servicesApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getServices: builder.query<ApiResponse<Service[]>, void>({
            query: () => `/api/private/services`,
            providesTags: ['Services'],
        }),
        getService: builder.query<ApiResponse<Service>, string>({
            query: (id) => `/api/private/services/${id}`,
            providesTags: ['Services'],
        }),
        createService: builder.mutation<ApiResponse<Service>, ServiceValues>({
            query: (body) => ({
                url: `/api/private/services`,
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Services'],
        }),
        updateService: builder.mutation<ApiResponse<Service>, { id: string; body: ServiceValues }>({
            query: ({ id, body }) => ({
                url: `/api/private/services/${id}`,
                method: 'PUT',
                body,
            }),
            invalidatesTags: ['Services'],
        }),
        deleteService: builder.mutation<ApiResponse<null>, string>({
            query: (id) => ({
                url: `/api/private/services/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Services'],
        }),
    }),
});

export const {
    useGetServicesQuery,
    useGetServiceQuery,
    useCreateServiceMutation,
    useUpdateServiceMutation,
    useDeleteServiceMutation,
} = servicesApi;
