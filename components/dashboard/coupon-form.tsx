'use client';
import {
    Button,
    TextInput,
    Textarea,
    NumberInput,
    Select,
    Stack,
    Text,
    Divider,
    Grid,
    Card,
    Switch,
} from '@mantine/core';
import { useEffect } from 'react';
import { schemaResolver, useForm } from '@mantine/form';
import { couponSchema, CouponValues } from '@/app/lib/validation/coupon';
import { Coupon, CouponDiscountType, CouponStatus } from '@/models/coupon';

interface CouponFormProps {
    coupon?: Coupon | null;
    onSubmit: (values: CouponValues) => void | Promise<void>;
    onCancel: () => void;
    loading?: boolean;
}

const labelStyles = {
    fontSize: 11,
    fontWeight: 700,
    textTransform: 'uppercase' as const,
    color: 'var(--mantine-color-gray-5)',
    marginBottom: 4,
};

export default function CouponForm({
    coupon,
    onSubmit,
    onCancel,
    loading = false,
}: CouponFormProps) {
    const form = useForm<CouponValues>({
        initialValues: {
            code: '',
            description: '',
            discountType: CouponDiscountType.PERCENTAGE,
            usageLimit: null,
            minimumSpend: null,
            status: CouponStatus.ACTIVE,
        },
        validate: schemaResolver(couponSchema),
    });

    useEffect(() => {
        if (coupon) {
            form.setValues({
                code: coupon.code || '',
                description: coupon.description || '',
                discountType: coupon.discountType || CouponDiscountType.PERCENTAGE,
                usageLimit: coupon.usageLimit,
                minimumSpend: coupon.minimumSpend,
                status: coupon.status || CouponStatus.ACTIVE,
            });
        } else {
            form.reset();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [coupon]);

    return (
        <form onSubmit={form.onSubmit(onSubmit)} noValidate>
            <Grid gap="xl">
                {/* Main Settings Panel */}
                <Grid.Col span={{ base: 12, md: 8 }}>
                    <Stack gap="lg">
                        <Card withBorder radius="lg" className="bg-white p-6 shadow-sm">
                            <Text fw={700} size="md" mb="md" className="text-gray-800">
                                Coupon Details
                            </Text>
                            <Divider mb="lg" />

                            <Grid gap="md">
                                <Grid.Col span={{ base: 12, sm: 6 }}>
                                    <TextInput
                                        id="coupon-code"
                                        label="Coupon Code"
                                        placeholder="e.g. SUMMER2026"
                                        required
                                        {...form.getInputProps('code')}
                                        styles={{ label: labelStyles }}
                                        onChange={(e) => {
                                            form.setFieldValue(
                                                'code',
                                                e.currentTarget.value.toUpperCase()
                                            );
                                        }}
                                    />
                                </Grid.Col>

                                <Grid.Col span={{ base: 12, sm: 6 }}>
                                    <Select
                                        id="coupon-discount-type"
                                        label="Discount Type"
                                        placeholder="Select type"
                                        data={[
                                            {
                                                value: CouponDiscountType.PERCENTAGE,
                                                label: 'Percentage (%)',
                                            },
                                            {
                                                value: CouponDiscountType.FIXED,
                                                label: 'Fixed ($)',
                                            },
                                        ]}
                                        required
                                        {...form.getInputProps('discountType')}
                                        styles={{ label: labelStyles }}
                                    />
                                </Grid.Col>

                                <Grid.Col span={{ base: 12 }}>
                                    <Textarea
                                        id="coupon-description"
                                        label="Description (Optional)"
                                        placeholder="Describe the promotion..."
                                        minRows={3}
                                        {...form.getInputProps('description')}
                                        styles={{ label: labelStyles }}
                                    />
                                </Grid.Col>
                            </Grid>
                        </Card>
                    </Stack>
                </Grid.Col>

                {/* Right Side: Limits and Status */}
                <Grid.Col span={{ base: 12, md: 4 }}>
                    <Stack gap="lg">
                        <Card withBorder radius="lg" className="bg-white p-6 shadow-sm">
                            <Text fw={700} size="md" mb="md" className="text-gray-800">
                                Parameters & Limits
                            </Text>
                            <Divider mb="lg" />

                            <Stack gap="md">
                                <Text size="11px" fw={700} className="text-gray-400 uppercase">
                                    Coupon Status
                                </Text>
                                <Switch
                                    id="coupon-status"
                                    label="Active Coupon"
                                    size="md"
                                    checked={form.values.status === CouponStatus.ACTIVE}
                                    onChange={(event) =>
                                        form.setFieldValue(
                                            'status',
                                            event.currentTarget.checked
                                                ? CouponStatus.ACTIVE
                                                : CouponStatus.INACTIVE
                                        )
                                    }
                                />

                                <Divider my="xs" />

                                <NumberInput
                                    id="coupon-usage-limit"
                                    label="Usage Limit Per Coupon"
                                    placeholder="Unlimited usage if left empty"
                                    min={1}
                                    allowDecimal={false}
                                    {...form.getInputProps('usageLimit')}
                                    styles={{ label: labelStyles }}
                                />

                                <NumberInput
                                    id="coupon-min-spend"
                                    label="Min Spend ($)"
                                    placeholder="No minimum spend"
                                    min={0}
                                    decimalScale={2}
                                    fixedDecimalScale
                                    hideControls
                                    {...form.getInputProps('minimumSpend')}
                                    styles={{ label: labelStyles }}
                                />
                            </Stack>
                        </Card>

                        {/* Submit Action Card */}
                        <Card withBorder radius="lg" className="bg-white p-6 shadow-sm">
                            <Stack gap="md">
                                <Button type="submit" size="md" fullWidth loading={loading}>
                                    {coupon ? 'Save Changes' : 'Create Coupon'}
                                </Button>
                                <Button
                                    variant="default"
                                    size="md"
                                    fullWidth
                                    onClick={onCancel}
                                    disabled={loading}
                                >
                                    Cancel
                                </Button>
                            </Stack>
                        </Card>
                    </Stack>
                </Grid.Col>
            </Grid>
        </form>
    );
}
