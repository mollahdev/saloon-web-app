import { apiSlice } from '../api-slice';
import { ApiResponse } from '@/models';
import { Coupon } from '@/models/coupon';
import { CouponValues } from '@/app/lib/validation/coupon';

export const couponsApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getCoupons: builder.query<ApiResponse<Coupon[]>, void>({
            query: () => `/api/private/coupons`,
            providesTags: ['Coupons'],
        }),
        getCoupon: builder.query<ApiResponse<Coupon>, string>({
            query: (id) => `/api/private/coupons/${id}`,
            providesTags: ['Coupons'],
        }),
        createCoupon: builder.mutation<ApiResponse<Coupon>, CouponValues>({
            query: (body) => ({
                url: `/api/private/coupons`,
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Coupons'],
        }),
        updateCoupon: builder.mutation<ApiResponse<Coupon>, { id: string; body: CouponValues }>({
            query: ({ id, body }) => ({
                url: `/api/private/coupons/${id}`,
                method: 'PUT',
                body,
            }),
            invalidatesTags: ['Coupons'],
        }),
        deleteCoupon: builder.mutation<ApiResponse<null>, string>({
            query: (id) => ({
                url: `/api/private/coupons/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Coupons'],
        }),
    }),
});

export const {
    useGetCouponsQuery,
    useGetCouponQuery,
    useCreateCouponMutation,
    useUpdateCouponMutation,
    useDeleteCouponMutation,
} = couponsApi;
