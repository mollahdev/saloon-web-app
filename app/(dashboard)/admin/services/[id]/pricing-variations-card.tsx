'use client';

import {
    Button,
    Card,
    Divider,
    Grid,
    NumberInput,
    Select,
    Stack,
    Switch,
    Text,
} from '@mantine/core';
import { UseFormReturnType } from '@mantine/form';
import { HiOutlineTrash } from 'react-icons/hi';
import { ServiceValues } from '@/app/lib/validation/service';
import { CouponList } from './coupon-list';
import { labelStyles } from './label-styles';

interface ActiveCoupon {
    id: string;
    code: string;
    status: string;
}

interface Staff {
    id: string;
    name: string;
    position?: string | null;
}

interface PricingVariationsCardProps {
    form: UseFormReturnType<ServiceValues>;
    allStaffs: Staff[];
    activeCoupons: ActiveCoupon[];
}

export function PricingVariationsCard({
    form,
    allStaffs,
    activeCoupons,
}: PricingVariationsCardProps) {
    const pricingVariations = form.values.pricingVariations || [];

    const handleAddVariation = () => {
        const selectedStaffIds = pricingVariations.map((v) => v.staffId) || [];
        const firstAvailableStaff = allStaffs.find((staff) => !selectedStaffIds.includes(staff.id));

        const nextStaffId = firstAvailableStaff ? firstAvailableStaff.id : '';
        form.setFieldValue('pricingVariations', [
            ...pricingVariations,
            {
                staffId: nextStaffId,
                price: form.values.price || 0,
                enableCoupons: false,
                coupons: [],
            },
        ]);
    };

    const handleRemoveVariation = (index: number) => {
        const updated = [...pricingVariations];
        updated.splice(index, 1);
        form.setFieldValue('pricingVariations', updated);
    };

    return (
        <Card withBorder radius="lg" className="bg-white p-6 shadow-sm">
            <Text fw={700} size="md" mb="md" className="text-gray-800">
                Pricing Variations
            </Text>
            <Divider mb="lg" />

            <Stack gap="md">
                {pricingVariations.length > 0 ? (
                    <div className="flex flex-col gap-4">
                        {pricingVariations.map((item, index) => {
                            // Exclude already selected staffs in other rows
                            const selectedStaffIds =
                                pricingVariations
                                    .map((v) => v.staffId)
                                    .filter((id) => id !== item.staffId) || [];

                            const availableStaffs = allStaffs.filter(
                                (staff) => !selectedStaffIds.includes(staff.id)
                            );

                            return (
                                <div
                                    key={index}
                                    className="p-4 border border-gray-200 rounded-xl bg-gray-50/30 flex flex-col gap-4"
                                >
                                    <Grid align="flex-end" gap="md">
                                        <Grid.Col span={{ base: 12, sm: 6 }}>
                                            <Select
                                                id={`variation-staff-${index}`}
                                                label="Staff Member"
                                                placeholder="Select a staff member"
                                                required
                                                data={availableStaffs.map((staff) => ({
                                                    value: staff.id,
                                                    label: `${staff.name} (${staff.position || 'Stylist'})`,
                                                }))}
                                                value={item.staffId}
                                                onChange={(val) => {
                                                    if (val) {
                                                        form.setFieldValue(
                                                            `pricingVariations.${index}.staffId`,
                                                            val
                                                        );
                                                    }
                                                }}
                                                styles={{ label: labelStyles }}
                                            />
                                        </Grid.Col>
                                        <Grid.Col span={{ base: 9, sm: 4 }}>
                                            <NumberInput
                                                id={`variation-price-${index}`}
                                                label="Custom Price ($)"
                                                placeholder="e.g. 50"
                                                min={1}
                                                allowDecimal={false}
                                                hideControls
                                                required
                                                value={item.price}
                                                onChange={(val) => {
                                                    form.setFieldValue(
                                                        `pricingVariations.${index}.price`,
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
                                                onClick={() => handleRemoveVariation(index)}
                                                className="h-[36px] flex items-center justify-center p-0"
                                            >
                                                <HiOutlineTrash size={18} />
                                            </Button>
                                        </Grid.Col>
                                    </Grid>

                                    {/* Staff Specific Coupon Section */}
                                    {activeCoupons.length > 0 && (
                                        <div className="border-t border-gray-100 pt-3">
                                            <Switch
                                                id={`variation-enable-coupons-${index}`}
                                                label="Enable Coupons for this Staff"
                                                size="sm"
                                                mb="xs"
                                                checked={item.enableCoupons}
                                                onChange={(event) => {
                                                    const checked = event.currentTarget.checked;
                                                    form.setFieldValue(
                                                        `pricingVariations.${index}.enableCoupons`,
                                                        checked
                                                    );
                                                    if (
                                                        checked &&
                                                        (!item.coupons || item.coupons.length === 0)
                                                    ) {
                                                        const firstAvailable = activeCoupons[0];
                                                        const nextCouponId = firstAvailable
                                                            ? firstAvailable.id
                                                            : '';
                                                        form.setFieldValue(
                                                            `pricingVariations.${index}.coupons`,
                                                            [
                                                                {
                                                                    couponId: nextCouponId,
                                                                    amount: 0,
                                                                },
                                                            ]
                                                        );
                                                    }
                                                }}
                                            />

                                            {item.enableCoupons && (
                                                <div className="mt-2 pl-4 border-l-2 border-indigo-50">
                                                    <CouponList
                                                        coupons={item.coupons || []}
                                                        activeCoupons={activeCoupons}
                                                        fieldPath={`pricingVariations.${index}.coupons`}
                                                        onSetFieldValue={form.setFieldValue}
                                                        addButtonSize="xs"
                                                        emptyMessage="No coupons configured for this staff. Click below to add one."
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <span className="text-center p-6 text-sm text-gray-600 flex items-center justify-center bg-gray-50 rounded-lg border border-dashed border-gray-200">
                        No staff-specific pricing configured. This service will use the base price
                        for all staff.
                    </span>
                )}
                <Button
                    variant="outline"
                    color="indigo"
                    size="sm"
                    disabled={pricingVariations.length >= allStaffs.length}
                    onClick={handleAddVariation}
                    className="mt-2 self-start w-fit"
                >
                    Add Pricing Variation
                </Button>
            </Stack>
        </Card>
    );
}
