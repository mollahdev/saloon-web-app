'use client';
import {
    Button,
    TextInput,
    Textarea,
    NumberInput,
    Select,
    MultiSelect,
    Stack,
    Text,
    Divider,
    Grid,
    Card,
    Switch,
} from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { useEffect } from 'react';
import { schemaResolver, useForm } from '@mantine/form';
import { useGetServicesQuery } from '@/app/lib/store/services/api';
import { useGetStaffsQuery } from '@/app/lib/store/staffs/api';
import { couponSchema, CouponValues } from '@/app/lib/validation/coupon';
import { Coupon, CouponDiscountType, CouponStatus } from '@/models/coupon';
import dayjs from 'dayjs';

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
    const { data: servicesRes } = useGetServicesQuery();
    const services = servicesRes?.data || [];

    const { data: staffsRes } = useGetStaffsQuery();
    const staffs = staffsRes?.data || [];

    const form = useForm<CouponValues>({
        initialValues: {
            code: '',
            description: '',
            discountType: CouponDiscountType.PERCENTAGE,
            amount: 0,
            expiryDate: '',
            usageLimit: null,
            minimumSpend: null,
            maximumSpend: null,
            services: [],
            excludeServices: [],
            staffs: [],
            excludeStaffs: [],
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
                amount: coupon.amount || 0,
                expiryDate: coupon.expiryDate ? dayjs(coupon.expiryDate).toISOString() : '',
                usageLimit: coupon.usageLimit,
                minimumSpend: coupon.minimumSpend,
                maximumSpend: coupon.maximumSpend,
                services: coupon.services ? coupon.services.map((s) => s.id) : [],
                excludeServices: coupon.excludeServices
                    ? coupon.excludeServices.map((s) => s.id)
                    : [],
                staffs: coupon.staffs ? coupon.staffs.map((s) => s.id) : [],
                excludeStaffs: coupon.excludeStaffs ? coupon.excludeStaffs.map((s) => s.id) : [],
                status: coupon.status || CouponStatus.ACTIVE,
            });
        } else {
            form.reset();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [coupon]);

    const applicableServicesData = services
        .filter(
            (s) =>
                !form.values.excludeServices?.includes(s.id) || form.values.services?.includes(s.id)
        )
        .map((s) => ({
            value: s.id,
            label: `${s.name} ($${s.price.toFixed(2)})`,
        }));

    const excludedServicesData = services
        .filter(
            (s) =>
                !form.values.services?.includes(s.id) || form.values.excludeServices?.includes(s.id)
        )
        .map((s) => ({
            value: s.id,
            label: `${s.name} ($${s.price.toFixed(2)})`,
        }));

    const applicableStaffsData = staffs
        .filter(
            (st) =>
                !form.values.excludeStaffs?.includes(st.id) || form.values.staffs?.includes(st.id)
        )
        .map((st) => ({
            value: st.id,
            label: `${st.name} (${st.position})`,
        }));

    const excludedStaffsData = staffs
        .filter(
            (st) =>
                !form.values.staffs?.includes(st.id) || form.values.excludeStaffs?.includes(st.id)
        )
        .map((st) => ({
            value: st.id,
            label: `${st.name} (${st.position})`,
        }));

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
                                                value: CouponDiscountType.FIXED_CART,
                                                label: 'Fixed Cart Discount ($)',
                                            },
                                            {
                                                value: CouponDiscountType.FIXED_SERVICE,
                                                label: 'Fixed Service Discount ($)',
                                            },
                                        ]}
                                        required
                                        {...form.getInputProps('discountType')}
                                        styles={{ label: labelStyles }}
                                    />
                                </Grid.Col>

                                <Grid.Col span={{ base: 12, sm: 6 }}>
                                    <NumberInput
                                        id="coupon-amount"
                                        label={
                                            form.values.discountType ===
                                            CouponDiscountType.PERCENTAGE
                                                ? 'Discount Percentage (%)'
                                                : 'Discount Amount ($)'
                                        }
                                        placeholder={
                                            form.values.discountType ===
                                            CouponDiscountType.PERCENTAGE
                                                ? 'e.g. 15'
                                                : 'e.g. 10.00'
                                        }
                                        min={0.01}
                                        max={
                                            form.values.discountType ===
                                            CouponDiscountType.PERCENTAGE
                                                ? 100
                                                : undefined
                                        }
                                        decimalScale={2}
                                        fixedDecimalScale={
                                            form.values.discountType !==
                                            CouponDiscountType.PERCENTAGE
                                        }
                                        hideControls
                                        required
                                        {...form.getInputProps('amount')}
                                        styles={{ label: labelStyles }}
                                    />
                                </Grid.Col>

                                <Grid.Col span={{ base: 12, sm: 6 }}>
                                    <DatePickerInput
                                        id="coupon-expiry"
                                        label="Expiry Date (Optional)"
                                        placeholder="Select expiry date"
                                        value={
                                            form.values.expiryDate
                                                ? new Date(form.values.expiryDate)
                                                : null
                                        }
                                        onChange={(date) => {
                                            form.setFieldValue(
                                                'expiryDate',
                                                date ? dayjs(date as any).toISOString() : ''
                                            );
                                        }}
                                        clearable
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

                        {/* Rules Card: Services & Staffs */}
                        <Card withBorder radius="lg" className="bg-white p-6 shadow-sm">
                            <Text fw={700} size="md" mb="md" className="text-gray-800">
                                Target & Exclusions Rules
                            </Text>
                            <Divider mb="lg" />

                            <Stack gap="lg">
                                {/* Services Section */}
                                <div>
                                    <Text fw={600} size="sm" mb="xs" className="text-gray-700">
                                        Services Settings
                                    </Text>
                                    <Grid gap="md">
                                        <Grid.Col span={{ base: 12, sm: 6 }}>
                                            <MultiSelect
                                                id="coupon-services"
                                                label="Apply to Services"
                                                placeholder="All services if left empty"
                                                data={applicableServicesData}
                                                searchable
                                                {...form.getInputProps('services')}
                                                styles={{ label: labelStyles }}
                                            />
                                        </Grid.Col>
                                        <Grid.Col span={{ base: 12, sm: 6 }}>
                                            <MultiSelect
                                                id="coupon-exclude-services"
                                                label="Exclude Services"
                                                placeholder="Select services to exclude"
                                                data={excludedServicesData}
                                                searchable
                                                {...form.getInputProps('excludeServices')}
                                                styles={{ label: labelStyles }}
                                            />
                                        </Grid.Col>
                                    </Grid>
                                </div>

                                <Divider variant="dashed" />

                                {/* Staffs Section */}
                                <div>
                                    <Text fw={600} size="sm" mb="xs" className="text-gray-700">
                                        Staff Members Settings
                                    </Text>
                                    <Grid gap="md">
                                        <Grid.Col span={{ base: 12, sm: 6 }}>
                                            <MultiSelect
                                                id="coupon-staffs"
                                                label="Apply to Staffs"
                                                placeholder="All staff members if left empty"
                                                data={applicableStaffsData}
                                                searchable
                                                {...form.getInputProps('staffs')}
                                                styles={{ label: labelStyles }}
                                            />
                                        </Grid.Col>
                                        <Grid.Col span={{ base: 12, sm: 6 }}>
                                            <MultiSelect
                                                id="coupon-exclude-staffs"
                                                label="Exclude Staffs"
                                                placeholder="Select staffs to exclude"
                                                data={excludedStaffsData}
                                                searchable
                                                {...form.getInputProps('excludeStaffs')}
                                                styles={{ label: labelStyles }}
                                            />
                                        </Grid.Col>
                                    </Grid>
                                </div>
                            </Stack>
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

                                <NumberInput
                                    id="coupon-max-spend"
                                    label="Max Spend ($)"
                                    placeholder="No maximum spend"
                                    min={0}
                                    decimalScale={2}
                                    fixedDecimalScale
                                    hideControls
                                    {...form.getInputProps('maximumSpend')}
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
