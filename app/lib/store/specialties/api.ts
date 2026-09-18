import { apiSlice } from '../api-slice';
import { ApiResponse } from '@/models';

export interface Specialty {
    id: string;
    name: string;
    createdAt: string;
    updatedAt: string;
}

export const specialtiesApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getSpecialties: builder.query<ApiResponse<Specialty[]>, void>({
            query: () => `/api/private/staffs/specialties`,
            providesTags: ['Specialties'],
        }),
    }),
    overrideExisting: true,
});

export const { useGetSpecialtiesQuery } = specialtiesApi;
