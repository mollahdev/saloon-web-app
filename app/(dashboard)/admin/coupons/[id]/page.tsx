'use client';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button, Card, Text } from '@mantine/core';
import { HiOutlineArrowLeft } from 'react-icons/hi';
import toast from 'react-hot-toast';
import { PageTitle } from '@/utils/portal';
import { useGetCouponQuery, useUpdateCouponMutation } from '@/app/lib/store/coupons/api';
import CouponForm from '@/components/dashboard/coupon-form';
import { CouponValues } from '@/app/lib/validation/coupon';
import CouponDetailLoading from './loading';
import dayjs from 'dayjs';

export default function EditCouponPage() {
    const params = useParams();
    const id = params.id as string;
    const router = useRouter();

    const { data: couponResponse, isLoading, error } = useGetCouponQuery(id);
    const coupon = couponResponse?.data;
    const [updateCoupon, { isLoading: isUpdating }] = useUpdateCouponMutation();

    const handleSubmit = async (values: CouponValues) => {
        try {
            // Transform and sanitize values before sending to backend
            const payload = {
                ...values,
                code: values.code.trim().toUpperCase(),
                expiryDate: values.expiryDate
                    ? dayjs(values.expiryDate).format('YYYY-MM-DD')
                    : null,
                usageLimit: values.usageLimit || null,
                minimumSpend: values.minimumSpend || null,
                maximumSpend: values.maximumSpend || null,
            };

            const response = await updateCoupon({ id, body: payload }).unwrap();
            toast.success(response.message || 'Coupon updated successfully');
            router.push('/admin/coupons');
        } catch {
            // Error is handled globally by rtkErrorMiddleware
        }
    };

    const handleCancel = () => {
        router.push('/admin/coupons');
    };

    if (isLoading) {
        return <CouponDetailLoading />;
    }

    if (error || !coupon) {
        return (
            <div className="max-w-xl mx-auto mt-10 text-center px-4">
                <Card padding="xl" radius="md" withBorder>
                    <Text size="lg" fw={700} c="red" mb="md">
                        Failed to load coupon details.
                    </Text>
                    <Text size="sm" c="dimmed" mb="lg">
                        The coupon may not exist, or you do not have permission to view or edit it.
                    </Text>
                    <Link href="/admin/coupons">
                        <Button variant="outline">Back to Coupons</Button>
                    </Link>
                </Card>
            </div>
        );
    }

    return (
        <div className="max-w-[1200px] mx-auto w-full pb-10">
            <PageTitle.Source>{`Edit Coupon: ${coupon.code}`}</PageTitle.Source>

            {/* Top Navigation */}
            <div className="mb-6">
                <Link href="/admin/coupons">
                    <Button
                        variant="subtle"
                        color="gray"
                        leftSection={<HiOutlineArrowLeft size={16} />}
                        size="sm"
                    >
                        Back to Coupons
                    </Button>
                </Link>
            </div>

            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Edit Coupon: {coupon.code}</h1>
                <p className="text-sm text-gray-500 mt-1">
                    Update the discount rate, thresholds, limits, and service restrictions for this
                    code
                </p>
            </div>

            <CouponForm
                coupon={coupon}
                onSubmit={handleSubmit}
                onCancel={handleCancel}
                loading={isUpdating}
            />
        </div>
    );
}
