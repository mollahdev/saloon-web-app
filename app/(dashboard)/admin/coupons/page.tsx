'use client';
import { SimpleGrid, Button } from '@mantine/core';
import { size } from 'lodash';
import Link from 'next/link';
import { PageTitle } from '@/utils/portal';
import { useGetCouponsQuery } from '@/app/lib/store/coupons/api';
import { CouponCard } from '@/components/dashboard/coupon-card';
import CouponsLoading from './loading';
import CouponsEmpty from './empty';

export default function CouponsPage() {
    const { data: response, isLoading, error } = useGetCouponsQuery();
    const coupons = response?.data || [];

    if (isLoading) {
        return (
            <>
                <PageTitle.Source>Coupons</PageTitle.Source>
                <CouponsLoading />
            </>
        );
    }

    if (error) {
        return (
            <>
                <PageTitle.Source>Coupons</PageTitle.Source>
                <div className="bg-red-50 p-4 rounded-lg text-red-600 max-w-[1300px] mx-auto w-full">
                    Failed to load coupons. Please try again later.
                </div>
            </>
        );
    }

    return (
        <div className="max-w-[1300px] mx-auto w-full px-4 md:px-0">
            <PageTitle.Source>Coupons</PageTitle.Source>

            {size(coupons) !== 0 && (
                <div className="flex flex-col gap-2 md:flex-row justify-between items-start md:items-center mb-6">
                    <div>
                        <h1 className="text-xl font-bold text-gray-800">Coupons</h1>
                        <p className="text-sm text-gray-500 mt-1">
                            Manage promotional discount codes and parameters
                        </p>
                    </div>
                    <Link href="/admin/coupons/create">
                        <Button id="create-coupon-btn" size="md">
                            Create New Coupon
                        </Button>
                    </Link>
                </div>
            )}

            {size(coupons) === 0 ? (
                <CouponsEmpty />
            ) : (
                <SimpleGrid
                    cols={{ base: 1, sm: 2, lg: 3, xl: 4 }}
                    spacing="lg"
                    verticalSpacing="lg"
                >
                    {coupons.map((coupon) => (
                        <CouponCard key={coupon.id} coupon={coupon} />
                    ))}
                </SimpleGrid>
            )}
        </div>
    );
}
