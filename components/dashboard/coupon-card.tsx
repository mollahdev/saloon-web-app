'use client';
import {
    Card,
    Stack,
    Group,
    Text,
    Divider,
    Tooltip,
    ActionIcon,
    Button,
    Badge,
    Progress,
} from '@mantine/core';
import { HiOutlineTrash, HiOutlineCalendar } from 'react-icons/hi';
import Link from 'next/link';
import { Coupon, CouponDiscountType, CouponStatus } from '@/models/coupon';
import { useConfirmation } from '@/hooks/use-confirmation';
import { useDeleteCouponMutation } from '@/app/lib/store/coupons/api';
import toast from 'react-hot-toast';
import dayjs from 'dayjs';

interface CouponCardProps {
    coupon: Coupon;
}

export function CouponCard({ coupon }: CouponCardProps) {
    const { confirm } = useConfirmation();
    const [deleteCoupon] = useDeleteCouponMutation();

    const handleDeleteClick = () => {
        confirm({
            title: 'Delete Coupon',
            message: `Are you sure you want to delete the coupon "${coupon.code}"? This action cannot be undone.`,
            confirmLabel: 'Delete',
            color: 'red',
            onConfirm: async () => {
                try {
                    await deleteCoupon(coupon.id).unwrap();
                    toast.success('Coupon deleted successfully');
                } catch {
                    // Handled globally by rtkErrorMiddleware
                }
            },
        });
    };

    const getDiscountText = () => {
        switch (coupon.discountType) {
            case CouponDiscountType.PERCENTAGE:
                return `${coupon.amount}% Off`;
            case CouponDiscountType.FIXED_CART:
                return `$${coupon.amount.toFixed(2)} Off Cart`;
            case CouponDiscountType.FIXED_SERVICE:
                return `$${coupon.amount.toFixed(2)} Off Service`;
            default:
                return `$${coupon.amount.toFixed(2)}`;
        }
    };

    const getDiscountTypeLabel = () => {
        switch (coupon.discountType) {
            case CouponDiscountType.PERCENTAGE:
                return 'Percentage';
            case CouponDiscountType.FIXED_CART:
                return 'Cart Discount';
            case CouponDiscountType.FIXED_SERVICE:
                return 'Service Discount';
            default:
                return 'Discount';
        }
    };

    const isExpired = coupon.expiryDate ? dayjs(coupon.expiryDate).isBefore(dayjs(), 'day') : false;
    const usageProgress = coupon.usageLimit ? (coupon.usageCount / coupon.usageLimit) * 100 : 0;
    const isActive = coupon.status === CouponStatus.ACTIVE && !isExpired;

    return (
        <Card
            padding="xl"
            radius="md"
            className="relative transition-all duration-200 border border-gray-100 overflow-hidden hover:-translate-y-1 hover:shadow-lg bg-white group flex flex-col h-full justify-between"
        >
            {/* Top Gradient Border */}
            <div
                className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${
                    isActive ? 'from-teal-500 to-cyan-400' : 'from-gray-400 to-gray-300'
                }`}
            />

            <Stack gap="sm" className="relative z-10 flex-grow">
                <div>
                    <Group justify="space-between" align="center" wrap="nowrap">
                        <Text className="text-lg font-mono font-bold text-gray-800 tracking-wider">
                            {coupon.code}
                        </Text>
                        <Group gap={6}>
                            {isExpired && (
                                <Badge color="red" variant="light" size="sm">
                                    Expired
                                </Badge>
                            )}
                            <Badge color={isActive ? 'teal' : 'gray'} variant="light" size="sm">
                                {coupon.status.toLowerCase()}
                            </Badge>
                        </Group>
                    </Group>
                    <Text className="text-[11px] text-gray-400 font-bold uppercase mt-1">
                        {getDiscountTypeLabel()}
                    </Text>
                </div>

                <div className="my-1">
                    <Text className="text-2xl font-black text-teal-600">{getDiscountText()}</Text>
                    {coupon.description && (
                        <Text className="text-xs text-gray-500 line-clamp-2 mt-1">
                            {coupon.description}
                        </Text>
                    )}
                </div>

                <div className="flex flex-col gap-2 mt-1">
                    {/* Expiry Date */}
                    <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
                        <HiOutlineCalendar size={14} className="text-gray-400 shrink-0" />
                        <span>
                            {coupon.expiryDate
                                ? `Expires: ${dayjs(coupon.expiryDate).format('MMM D, YYYY')}`
                                : 'No expiry date'}
                        </span>
                    </div>

                    {/* Spend Thresholds */}
                    {(coupon.minimumSpend || coupon.maximumSpend) && (
                        <div className="flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-gray-500 font-semibold uppercase">
                            {coupon.minimumSpend && (
                                <span>Min: ${coupon.minimumSpend.toFixed(2)}</span>
                            )}
                            {coupon.maximumSpend && (
                                <span>Max: ${coupon.maximumSpend.toFixed(2)}</span>
                            )}
                        </div>
                    )}

                    {/* Usage Progress */}
                    <div className="mt-1">
                        <div className="flex justify-between text-xs text-gray-500 font-medium mb-1">
                            <span>Usage</span>
                            <span>
                                {coupon.usageLimit
                                    ? `${coupon.usageCount} / ${coupon.usageLimit}`
                                    : `${coupon.usageCount} used`}
                            </span>
                        </div>
                        {coupon.usageLimit ? (
                            <Progress
                                value={usageProgress}
                                size="xs"
                                color={usageProgress >= 90 ? 'red' : 'teal'}
                                radius="xl"
                            />
                        ) : null}
                    </div>
                </div>

                {/* Services Rules */}
                <div className="border-t border-gray-50 pt-2 mt-2 flex flex-col gap-1.5">
                    <div className="flex flex-col gap-1">
                        <Text size="xs" fw={700} className="text-gray-400 shrink-0 uppercase">
                            Applies to:
                        </Text>
                        {coupon.services && coupon.services.length > 0 ? (
                            <div className="flex flex-wrap gap-1 max-h-[50px] overflow-y-auto">
                                {coupon.services.map((s) => (
                                    <Badge
                                        key={s.id}
                                        size="xs"
                                        color="indigo"
                                        variant="light"
                                        className="normal-case"
                                    >
                                        {s.name}
                                    </Badge>
                                ))}
                            </div>
                        ) : (
                            <div>
                                <Badge size="xs" color="teal" variant="light">
                                    All services
                                </Badge>
                            </div>
                        )}
                    </div>

                    {coupon.excludeServices && coupon.excludeServices.length > 0 && (
                        <div className="flex flex-col gap-1">
                            <Text size="xs" fw={700} className="text-gray-400 shrink-0 uppercase">
                                Excludes:
                            </Text>
                            <div className="flex flex-wrap gap-1 max-h-[50px] overflow-y-auto">
                                {coupon.excludeServices.map((s) => (
                                    <Badge
                                        key={s.id}
                                        size="xs"
                                        color="red"
                                        variant="light"
                                        className="normal-case"
                                    >
                                        {s.name}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Staff Rules */}
                    {((coupon.staffs && coupon.staffs.length > 0) ||
                        (coupon.excludeStaffs && coupon.excludeStaffs.length > 0)) && (
                        <Divider my={4} variant="dashed" className="opacity-40" />
                    )}

                    {coupon.staffs && coupon.staffs.length > 0 && (
                        <div className="flex flex-col gap-1">
                            <Text size="xs" fw={700} className="text-gray-400 shrink-0 uppercase">
                                Target Staffs:
                            </Text>
                            <div className="flex flex-wrap gap-1 max-h-[50px] overflow-y-auto">
                                {coupon.staffs.map((st) => (
                                    <Badge
                                        key={st.id}
                                        size="xs"
                                        color="blue"
                                        variant="light"
                                        className="normal-case"
                                    >
                                        {st.name}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    )}

                    {coupon.excludeStaffs && coupon.excludeStaffs.length > 0 && (
                        <div className="flex flex-col gap-1">
                            <Text size="xs" fw={700} className="text-gray-400 shrink-0 uppercase">
                                Exclude Staffs:
                            </Text>
                            <div className="flex flex-wrap gap-1 max-h-[50px] overflow-y-auto">
                                {coupon.excludeStaffs.map((st) => (
                                    <Badge
                                        key={st.id}
                                        size="xs"
                                        color="pink"
                                        variant="light"
                                        className="normal-case"
                                    >
                                        {st.name}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </Stack>

            <Divider my="md" variant="dashed" className="opacity-60" />

            <div className="flex flex-row items-center gap-1.5 w-full mt-auto">
                <Link href={`/admin/coupons/${coupon.id}`} className="flex-grow">
                    <Button
                        variant="light"
                        color="blue"
                        size="sm"
                        fullWidth
                        className="h-9 transition-all hover:bg-blue-100 font-bold text-[13px]"
                    >
                        Edit Coupon
                    </Button>
                </Link>

                <Tooltip label="Delete Coupon" withArrow>
                    <ActionIcon
                        variant="light"
                        color="red"
                        size="lg"
                        className="h-9 w-9 transition-colors duration-200 hover:bg-red-100 shrink-0"
                        onClick={handleDeleteClick}
                    >
                        <HiOutlineTrash size={18} strokeWidth={1.5} />
                    </ActionIcon>
                </Tooltip>
            </div>
        </Card>
    );
}
