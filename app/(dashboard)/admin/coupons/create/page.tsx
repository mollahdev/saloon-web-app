'use client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@mantine/core';
import { HiOutlineArrowLeft } from 'react-icons/hi';
import toast from 'react-hot-toast';
import { PageTitle } from '@/utils/portal';
import { useCreateCouponMutation } from '@/app/lib/store/coupons/api';
import CouponForm from '@/components/dashboard/coupon-form';
import { CouponValues } from '@/app/lib/validation/coupon';
import dayjs from 'dayjs';

export default function CreateCouponPage() {
    const router = useRouter();
    const [createCoupon, { isLoading }] = useCreateCouponMutation();

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

            const response = await createCoupon(payload).unwrap();
            toast.success(response.message || 'Coupon created successfully');
            router.push('/admin/coupons');
        } catch {
            // Error is handled globally by rtkErrorMiddleware
        }
    };

    const handleCancel = () => {
        router.push('/admin/coupons');
    };

    return (
        <div className="max-w-[1200px] mx-auto w-full pb-10">
            <PageTitle.Source>Create Coupon</PageTitle.Source>

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
                <h1 className="text-2xl font-bold text-gray-800">Create Promotional Coupon</h1>
                <p className="text-sm text-gray-500 mt-1">
                    Configure a new discount rule, thresholds, limits, and service restrictions
                </p>
            </div>

            <CouponForm onSubmit={handleSubmit} onCancel={handleCancel} loading={isLoading} />
        </div>
    );
}
