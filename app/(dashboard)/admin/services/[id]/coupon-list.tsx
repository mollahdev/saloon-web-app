'use client';

import { Button, Grid, NumberInput, Select, Stack } from '@mantine/core';
import { HiOutlineTrash } from 'react-icons/hi';
import { labelStyles } from './label-styles';

interface CouponEntry {
    couponId: string;
    amount: number;
}

interface ActiveCoupon {
    id: string;
    code: string;
    status: string;
}

interface CouponListProps {
    coupons: CouponEntry[];
    activeCoupons: ActiveCoupon[];
    /** Base field path, e.g. "coupons" or "pricingVariations.0.coupons" */
    fieldPath: string;
    onSetFieldValue: (path: string, value: unknown) => void;
    /** Size of the add button */
    addButtonSize?: string;
    /** Empty state message */
    emptyMessage?: string;
}

export function CouponList({
    coupons,
    activeCoupons,
    fieldPath,
    onSetFieldValue,
    addButtonSize = 'sm',
    emptyMessage = 'No coupons configured. Click below to add one.',
}: CouponListProps) {
    const handleAddCoupon = () => {
        const selectedCouponIds = coupons?.map((c) => c.couponId) || [];
        const firstAvailable = activeCoupons.find((c) => !selectedCouponIds.includes(c.id));
        const nextCouponId = firstAvailable ? firstAvailable.id : '';
        const currentCoupons = coupons || [];
        onSetFieldValue(fieldPath, [...currentCoupons, { couponId: nextCouponId, amount: 0 }]);
    };

    const handleRemoveCoupon = (index: number) => {
        const updated = [...(coupons || [])];
        updated.splice(index, 1);
        onSetFieldValue(fieldPath, updated);
    };

    return (
        <Stack gap="sm">
            {coupons && coupons.length > 0 ? (
                <div className="flex flex-col gap-3">
                    {coupons.map((item, index) => {
                        // Filter out already selected coupons
                        const selectedCouponIds =
                            coupons?.map((c) => c.couponId).filter((id) => id !== item.couponId) ||
                            [];
                        const availableCoupons = activeCoupons.filter(
                            (c) => !selectedCouponIds.includes(c.id)
                        );

                        return (
                            <Grid key={index} align="flex-end" gap="md">
                                <Grid.Col span={{ base: 12, sm: 6 }}>
                                    <Select
                                        id={`${fieldPath}-select-${index}`}
                                        label="Coupon Code"
                                        placeholder="Select a coupon"
                                        required
                                        data={availableCoupons.map((c) => ({
                                            value: c.id,
                                            label: c.code,
                                        }))}
                                        value={item.couponId}
                                        onChange={(val) => {
                                            if (val) {
                                                onSetFieldValue(
                                                    `${fieldPath}.${index}.couponId`,
                                                    val
                                                );
                                            }
                                        }}
                                        styles={{ label: labelStyles }}
                                    />
                                </Grid.Col>
                                <Grid.Col span={{ base: 9, sm: 4 }}>
                                    <NumberInput
                                        id={`${fieldPath}-amount-${index}`}
                                        label="Discount Price / Value ($)"
                                        placeholder="e.g. 10"
                                        min={1}
                                        allowDecimal={false}
                                        hideControls
                                        required
                                        value={item.amount}
                                        onChange={(val) => {
                                            onSetFieldValue(
                                                `${fieldPath}.${index}.amount`,
                                                typeof val === 'number' ? val : 0
                                            );
                                        }}
                                        styles={{ label: labelStyles }}
                                    />
                                </Grid.Col>
                                <Grid.Col span={{ base: 3, sm: 2 }}>
                                    <Button
                                        variant="light"
                                        color="red"
                                        fullWidth
                                        disabled={coupons.length === 1}
                                        onClick={() => handleRemoveCoupon(index)}
                                        className="h-[36px] flex items-center justify-center p-0"
                                    >
                                        <HiOutlineTrash size={18} />
                                    </Button>
                                </Grid.Col>
                            </Grid>
                        );
                    })}
                </div>
            ) : (
                <span className="text-center p-6 flex items-center justify-center bg-gray-50 text-sm text-gray-600 rounded-lg border border-dashed border-gray-200">
                    {emptyMessage}
                </span>
            )}

            <Button
                variant="outline"
                color="indigo"
                size={addButtonSize}
                disabled={coupons && coupons.length >= activeCoupons.length}
                onClick={handleAddCoupon}
                className="mt-2 self-start w-fit"
            >
                Add Coupon
            </Button>
        </Stack>
    );
}
