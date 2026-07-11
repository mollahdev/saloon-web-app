'use client';

import { useEffect, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    Button,
    Divider,
    TextInput,
    Textarea,
    NumberInput,
    Grid,
    Card,
    Text,
    Group,
    Stack,
    Badge,
    Loader,
    Switch,
    Select,
} from '@mantine/core';
import { schemaResolver, useForm } from '@mantine/form';
import toast from 'react-hot-toast';
import {
    HiOutlineArrowLeft,
    HiOutlineUpload,
    HiOutlineClock,
    HiOutlineTrash,
} from 'react-icons/hi';
import { useAppSelector } from '@/app/lib/store';
import { PageTitle } from '@/utils/portal';
import {
    useGetServiceQuery,
    useCreateServiceMutation,
    useUpdateServiceMutation,
} from '@/app/lib/store/services/api';
import { useGetStaffsQuery } from '@/app/lib/store/staffs/api';
import { useGetCouponsQuery } from '@/app/lib/store/coupons/api';
import { serviceSchema, ServiceValues } from '@/app/lib/validation/service';

const labelStyles = {
    fontSize: 11,
    fontWeight: 700,
    textTransform: 'uppercase' as const,
    color: 'var(--mantine-color-gray-5)',
    marginBottom: 4,
};

export default function EditServicePage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;
    const isNew = id === 'new';

    const { data: serviceResponse, isLoading, error } = useGetServiceQuery(id, { skip: isNew });
    const service = serviceResponse?.data;

    const { data: staffsResponse } = useGetStaffsQuery();
    const allStaffs = (staffsResponse?.data || []).filter((s) => s.status === 'ACTIVE');

    const { data: couponsResponse } = useGetCouponsQuery();
    const activeCoupons = (couponsResponse?.data || []).filter((c) => c.status === 'ACTIVE');

    const [createService, { isLoading: isCreating }] = useCreateServiceMutation();
    const [updateService, { isLoading: isUpdating }] = useUpdateServiceMutation();
    const isMutating = isCreating || isUpdating;

    const accessToken = useAppSelector((state) => state.auth.accessToken);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isUploadingImage, setIsUploadingImage] = useState(false);

    const form = useForm<ServiceValues>({
        initialValues: {
            name: '',
            description: '',
            price: 0,
            duration: 0,
            image: '',
            status: 'ACTIVE',
            enableCoupons: false,
            coupons: [],
            pricingVariations: [],
        },
        validate: schemaResolver(serviceSchema),
    });

    useEffect(() => {
        if (!isNew && service) {
            form.setValues({
                name: service.name || '',
                description: service.description || '',
                price: service.price || 0,
                duration: service.duration || 0,
                image: service.image || '',
                status: service.status || 'ACTIVE',
                enableCoupons: !!(service.serviceCoupons && service.serviceCoupons.length > 0),
                coupons:
                    service.serviceCoupons?.map((c) => ({
                        couponId: c.couponId,
                        amount: c.amount,
                    })) || [],
                pricingVariations:
                    service.pricingVariations?.map((p) => ({
                        staffId: p.staffId,
                        price: p.price,
                        enableCoupons: !!(p.pricingCoupons && p.pricingCoupons.length > 0),
                        coupons:
                            p.pricingCoupons?.map((c) => ({
                                couponId: c.couponId,
                                amount: c.amount,
                            })) || [],
                    })) || [],
            });
        } else if (isNew) {
            form.reset();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [service, isNew]);

    const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // Validate MIME type
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
        if (!allowedTypes.includes(file.type)) {
            toast.error('Invalid file type. Only JPEG, PNG, WEBP, and GIF are allowed.');
            return;
        }

        // Validate file size (5MB limit)
        const maxSizeBytes = 5 * 1024 * 1024;
        if (file.size > maxSizeBytes) {
            toast.error('File size exceeds the 5MB limit.');
            return;
        }

        setIsUploadingImage(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch('/api/private/upload', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                body: formData,
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.message || 'Upload failed');
            }

            const result = await response.json();
            form.setFieldValue('image', result.data.url);
        } catch (error: any) {
            toast.error(error.message || 'Failed to upload image');
        } finally {
            setIsUploadingImage(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const handleRemoveImage = () => {
        form.setFieldValue('image', '');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleSubmit = async (values: ServiceValues) => {
        const payload = {
            ...values,
            coupons: values.enableCoupons ? values.coupons : [],
            pricingVariations:
                values.pricingVariations?.map((p) => ({
                    ...p,
                    coupons: p.enableCoupons ? p.coupons : [],
                })) || [],
        };
        try {
            if (isNew) {
                const response = await createService(payload).unwrap();
                toast.success(response.message || 'Service created successfully');
                router.push('/admin/services');
            } else {
                const response = await updateService({ id, body: payload }).unwrap();
                toast.success(response.message || 'Service updated successfully');
            }
        } catch {
            // Error is handled globally by rtkErrorMiddleware
        }
    };

    if (!isNew && isLoading) {
        return (
            <div className="max-w-[1200px] mx-auto w-full pb-10">
                <PageTitle.Source>Edit Service</PageTitle.Source>
                <div className="mb-6">
                    <Link href="/admin/services">
                        <Button
                            variant="subtle"
                            color="gray"
                            leftSection={<HiOutlineArrowLeft size={16} />}
                            size="sm"
                        >
                            Back to Services
                        </Button>
                    </Link>
                </div>
                <div className="flex items-center gap-2 p-6 bg-white rounded-lg border border-gray-100 shadow-sm max-w-[650px]">
                    <Loader size="sm" />
                    <span className="text-sm text-gray-500">Loading service details...</span>
                </div>
            </div>
        );
    }

    if (!isNew && (error || !service)) {
        return (
            <div className="max-w-xl mx-auto mt-10 text-center">
                <Card padding="xl" radius="md" withBorder>
                    <Text size="lg" fw={700} c="red" mb="md">
                        Failed to load service details.
                    </Text>
                    <Text size="sm" c="dimmed" mb="lg">
                        The service may not exist or you do not have permission to view/edit it.
                    </Text>
                    <Link href="/admin/services">
                        <Button variant="outline">Back to Services</Button>
                    </Link>
                </Card>
            </div>
        );
    }

    return (
        <div className="max-w-[1200px] mx-auto w-full pb-10">
            <PageTitle.Source>
                {isNew ? 'Add Service' : `Service: ${service?.name}`}
            </PageTitle.Source>

            {/* Top Navigation */}
            <div className="mb-6 flex flex-col gap-3">
                <Link href="/admin/services" className="w-fit">
                    <Button
                        variant="subtle"
                        color="gray"
                        leftSection={<HiOutlineArrowLeft size={16} />}
                        size="sm"
                    >
                        Back to Services
                    </Button>
                </Link>

                <div>
                    <h1 className="text-xl font-bold text-gray-800">
                        {isNew ? 'Add New Service' : `Edit Service: ${service?.name}`}
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        {isNew
                            ? 'Create a new service in your saloon directory'
                            : 'Modify the details, status, and image of this service'}
                    </p>
                </div>
            </div>

            <form onSubmit={form.onSubmit(handleSubmit)} noValidate>
                <Grid gap="xl">
                    {/* Left Panel: Service Image & Summary */}
                    <Grid.Col span={{ base: 12, md: 4 }}>
                        <Stack gap="lg">
                            <Card
                                withBorder
                                radius="lg"
                                className="bg-white p-6 relative overflow-hidden shadow-sm"
                            >
                                {/* Decorator Header */}
                                <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-500 to-indigo-500" />

                                <Stack align="center" gap="md" className="mt-2">
                                    <div className="relative group w-full">
                                        {/* Hidden file input */}
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            onChange={handleUpload}
                                            accept="image/png,image/jpeg,image/gif,image/webp"
                                            style={{ display: 'none' }}
                                        />

                                        {form.values.image ? (
                                            <div className="relative rounded-lg overflow-hidden border border-gray-100 shadow-sm w-full h-44 bg-gray-50 flex items-center justify-center">
                                                <img
                                                    src={form.values.image}
                                                    alt="Service Preview"
                                                    className="w-full h-full object-cover"
                                                />
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                                    <Button
                                                        size="xs"
                                                        variant="filled"
                                                        color="blue"
                                                        onClick={() =>
                                                            fileInputRef.current?.click()
                                                        }
                                                        disabled={isUploadingImage}
                                                    >
                                                        Change
                                                    </Button>
                                                    <Button
                                                        size="xs"
                                                        variant="filled"
                                                        color="red"
                                                        onClick={handleRemoveImage}
                                                        disabled={isUploadingImage}
                                                    >
                                                        Remove
                                                    </Button>
                                                </div>
                                                {isUploadingImage && (
                                                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white">
                                                        <Loader size="xs" color="white" />
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <div
                                                onClick={() =>
                                                    !isUploadingImage &&
                                                    fileInputRef.current?.click()
                                                }
                                                className="border-2 border-dashed border-gray-200 rounded-lg w-full h-44 flex flex-col items-center justify-center cursor-pointer hover:border-indigo-500 hover:bg-indigo-50/20 transition-all gap-2 bg-gray-50/50"
                                            >
                                                {isUploadingImage ? (
                                                    <>
                                                        <Loader size="xs" color="indigo" />
                                                        <Text size="xs" className="text-gray-500">
                                                            Uploading image...
                                                        </Text>
                                                    </>
                                                ) : (
                                                    <>
                                                        <HiOutlineUpload
                                                            size={24}
                                                            className="text-gray-400"
                                                        />
                                                        <Text
                                                            size="xs"
                                                            fw={600}
                                                            className="text-gray-600 text-center"
                                                        >
                                                            Click to upload image
                                                        </Text>
                                                    </>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    <div className="text-center w-full">
                                        <Text fw={700} size="lg" className="line-clamp-1">
                                            {form.values.name || 'Service Name'}
                                        </Text>
                                        <Text size="md" c="indigo" fw={700} mt="xs">
                                            ${Math.round(Number(form.values.price || 0))}
                                        </Text>
                                    </div>

                                    <Group justify="center" gap="xs">
                                        <Badge
                                            color="indigo"
                                            variant="light"
                                            leftSection={
                                                <HiOutlineClock size={12} className="mt-0.5" />
                                            }
                                            className="font-semibold px-2.5 py-1 h-auto"
                                        >
                                            {form.values.duration || 0} mins
                                        </Badge>
                                        <Badge
                                            color={
                                                form.values.status === 'ACTIVE' ? 'teal' : 'orange'
                                            }
                                            variant="light"
                                            className="font-semibold px-2.5 py-1 h-auto"
                                        >
                                            {form.values.status === 'ACTIVE'
                                                ? 'Active'
                                                : 'Inactive'}
                                        </Badge>
                                    </Group>
                                </Stack>
                            </Card>
                        </Stack>
                    </Grid.Col>

                    {/* Right Panel: Main Form Fields */}
                    <Grid.Col span={{ base: 12, md: 8 }}>
                        <Stack gap="lg">
                            <Card withBorder radius="lg" className="bg-white p-6 shadow-sm">
                                <Text fw={700} size="md" mb="md" className="text-gray-800">
                                    Service Details
                                </Text>
                                <Divider mb="lg" />

                                <Grid gap="md">
                                    <Grid.Col span={{ base: 12 }}>
                                        <TextInput
                                            id="service-name"
                                            label="Service Name"
                                            placeholder="e.g. Premium Haircut"
                                            required
                                            {...form.getInputProps('name')}
                                            styles={{ label: labelStyles }}
                                        />
                                    </Grid.Col>

                                    <Grid.Col span={{ base: 12, sm: 6 }}>
                                        <NumberInput
                                            id="service-price"
                                            label="Price ($)"
                                            placeholder="e.g. 45"
                                            min={1}
                                            allowDecimal={false}
                                            hideControls
                                            required
                                            {...form.getInputProps('price')}
                                            styles={{ label: labelStyles }}
                                        />
                                    </Grid.Col>

                                    <Grid.Col span={{ base: 12, sm: 6 }}>
                                        <NumberInput
                                            id="service-duration"
                                            label="Duration (Minutes)"
                                            placeholder="e.g. 30"
                                            min={1}
                                            allowDecimal={false}
                                            required
                                            {...form.getInputProps('duration')}
                                            styles={{ label: labelStyles }}
                                        />
                                    </Grid.Col>

                                    <Grid.Col span={{ base: 12 }}>
                                        <Textarea
                                            id="service-description"
                                            label="Description (Optional)"
                                            placeholder="Describe what the service includes..."
                                            minRows={4}
                                            {...form.getInputProps('description')}
                                            styles={{ label: labelStyles }}
                                        />
                                    </Grid.Col>

                                    {/* Availability Settings Toggle */}
                                    <Grid.Col span={{ base: 12 }} className="mt-2">
                                        <Divider
                                            label="Service Availability"
                                            labelPosition="left"
                                            mb="md"
                                        />
                                        <Switch
                                            id="service-status"
                                            label="Active Service"
                                            size="md"
                                            checked={form.values.status === 'ACTIVE'}
                                            onChange={(event) =>
                                                form.setFieldValue(
                                                    'status',
                                                    event.currentTarget.checked
                                                        ? 'ACTIVE'
                                                        : 'INACTIVE'
                                                )
                                            }
                                        />
                                    </Grid.Col>

                                    {/* Coupon Settings Toggle & Inputs for Base Price */}
                                    {activeCoupons.length > 0 && (
                                        <Grid.Col span={{ base: 12 }} className="mt-4">
                                            <Divider
                                                label="Coupon Settings"
                                                labelPosition="left"
                                                mb="md"
                                            />
                                            <Switch
                                                id="enable-coupons"
                                                label="Enable Base Price Coupons"
                                                size="md"
                                                mb="md"
                                                checked={form.values.enableCoupons}
                                                onChange={(event) => {
                                                    const checked = event.currentTarget.checked;
                                                    form.setFieldValue('enableCoupons', checked);
                                                    if (
                                                        checked &&
                                                        (!form.values.coupons ||
                                                            form.values.coupons.length === 0)
                                                    ) {
                                                        const firstAvailable = activeCoupons[0];
                                                        const nextCouponId = firstAvailable
                                                            ? firstAvailable.id
                                                            : '';
                                                        form.setFieldValue('coupons', [
                                                            { couponId: nextCouponId, amount: 0 },
                                                        ]);
                                                    }
                                                }}
                                            />

                                            {form.values.enableCoupons && (
                                                <Stack gap="sm">
                                                    {form.values.coupons &&
                                                    form.values.coupons.length > 0 ? (
                                                        <div className="flex flex-col gap-3">
                                                            {form.values.coupons.map(
                                                                (item, index) => {
                                                                    // Filter out already selected coupons
                                                                    const selectedCouponIds =
                                                                        form.values.coupons
                                                                            ?.map((c) => c.couponId)
                                                                            .filter(
                                                                                (id) =>
                                                                                    id !==
                                                                                    item.couponId
                                                                            ) || [];
                                                                    const availableCoupons =
                                                                        activeCoupons.filter(
                                                                            (c) =>
                                                                                !selectedCouponIds.includes(
                                                                                    c.id
                                                                                )
                                                                        );

                                                                    return (
                                                                        <Grid
                                                                            key={index}
                                                                            align="flex-end"
                                                                            gap="md"
                                                                        >
                                                                            <Grid.Col
                                                                                span={{
                                                                                    base: 12,
                                                                                    sm: 6,
                                                                                }}
                                                                            >
                                                                                <Select
                                                                                    id={`coupon-select-${index}`}
                                                                                    label="Coupon Code"
                                                                                    placeholder="Select a coupon"
                                                                                    required
                                                                                    data={availableCoupons.map(
                                                                                        (c) => ({
                                                                                            value: c.id,
                                                                                            label: c.code,
                                                                                        })
                                                                                    )}
                                                                                    value={
                                                                                        item.couponId
                                                                                    }
                                                                                    onChange={(
                                                                                        val
                                                                                    ) => {
                                                                                        if (val) {
                                                                                            form.setFieldValue(
                                                                                                `coupons.${index}.couponId`,
                                                                                                val
                                                                                            );
                                                                                        }
                                                                                    }}
                                                                                    styles={{
                                                                                        label: labelStyles,
                                                                                    }}
                                                                                />
                                                                            </Grid.Col>
                                                                            <Grid.Col
                                                                                span={{
                                                                                    base: 9,
                                                                                    sm: 4,
                                                                                }}
                                                                            >
                                                                                <NumberInput
                                                                                    id={`coupon-amount-${index}`}
                                                                                    label="Discount Price / Value ($)"
                                                                                    placeholder="e.g. 10"
                                                                                    min={1}
                                                                                    allowDecimal={
                                                                                        false
                                                                                    }
                                                                                    hideControls
                                                                                    required
                                                                                    value={
                                                                                        item.amount
                                                                                    }
                                                                                    onChange={(
                                                                                        val
                                                                                    ) => {
                                                                                        form.setFieldValue(
                                                                                            `coupons.${index}.amount`,
                                                                                            typeof val ===
                                                                                                'number'
                                                                                                ? val
                                                                                                : 0
                                                                                        );
                                                                                    }}
                                                                                    styles={{
                                                                                        label: labelStyles,
                                                                                    }}
                                                                                />
                                                                            </Grid.Col>
                                                                            <Grid.Col
                                                                                span={{
                                                                                    base: 3,
                                                                                    sm: 2,
                                                                                }}
                                                                            >
                                                                                <Button
                                                                                    variant="light"
                                                                                    color="red"
                                                                                    fullWidth
                                                                                    disabled={
                                                                                        form.values
                                                                                            .coupons
                                                                                            .length ===
                                                                                        1
                                                                                    }
                                                                                    onClick={() => {
                                                                                        const updated =
                                                                                            [
                                                                                                ...(form
                                                                                                    .values
                                                                                                    .coupons ||
                                                                                                    []),
                                                                                            ];
                                                                                        updated.splice(
                                                                                            index,
                                                                                            1
                                                                                        );
                                                                                        form.setFieldValue(
                                                                                            'coupons',
                                                                                            updated
                                                                                        );
                                                                                    }}
                                                                                    className="h-[36px] flex items-center justify-center p-0"
                                                                                >
                                                                                    <HiOutlineTrash
                                                                                        size={18}
                                                                                    />
                                                                                </Button>
                                                                            </Grid.Col>
                                                                        </Grid>
                                                                    );
                                                                }
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <span className="text-center p-6 flex items-center justify-center bg-gray-50 text-sm text-gray-600 rounded-lg border border-dashed border-gray-200">
                                                            No coupons configured for base price.
                                                            Click below to add one.
                                                        </span>
                                                    )}

                                                    <Button
                                                        variant="outline"
                                                        color="indigo"
                                                        size="sm"
                                                        disabled={
                                                            form.values.coupons &&
                                                            form.values.coupons.length >=
                                                                activeCoupons.length
                                                        }
                                                        onClick={() => {
                                                            const selectedCouponIds =
                                                                form.values.coupons?.map(
                                                                    (c) => c.couponId
                                                                ) || [];
                                                            const firstAvailable =
                                                                activeCoupons.find(
                                                                    (c) =>
                                                                        !selectedCouponIds.includes(
                                                                            c.id
                                                                        )
                                                                );
                                                            const nextCouponId = firstAvailable
                                                                ? firstAvailable.id
                                                                : '';
                                                            const currentCoupons =
                                                                form.values.coupons || [];
                                                            form.setFieldValue('coupons', [
                                                                ...currentCoupons,
                                                                {
                                                                    couponId: nextCouponId,
                                                                    amount: 0,
                                                                },
                                                            ]);
                                                        }}
                                                        className="mt-2 self-start w-fit"
                                                    >
                                                        Add Coupon
                                                    </Button>
                                                </Stack>
                                            )}
                                        </Grid.Col>
                                    )}
                                </Grid>
                            </Card>

                            {/* Pricing Variations Card */}
                            {allStaffs.length > 0 && (
                                <Card withBorder radius="lg" className="bg-white p-6 shadow-sm">
                                    <Text fw={700} size="md" mb="md" className="text-gray-800">
                                        Pricing Variations
                                    </Text>
                                    <Divider mb="lg" />

                                    <Stack gap="md">
                                        {form.values.pricingVariations &&
                                        form.values.pricingVariations.length > 0 ? (
                                            <div className="flex flex-col gap-4">
                                                {form.values.pricingVariations.map(
                                                    (item, index) => {
                                                        // Exclude already selected staffs in other rows
                                                        const selectedStaffIds =
                                                            form.values.pricingVariations
                                                                ?.map((v) => v.staffId)
                                                                .filter(
                                                                    (id) => id !== item.staffId
                                                                ) || [];

                                                        const availableStaffs = allStaffs.filter(
                                                            (staff) =>
                                                                !selectedStaffIds.includes(staff.id)
                                                        );

                                                        return (
                                                            <div
                                                                key={index}
                                                                className="p-4 border border-gray-200 rounded-xl bg-gray-50/30 flex flex-col gap-4"
                                                            >
                                                                <Grid align="flex-end" gap="md">
                                                                    <Grid.Col
                                                                        span={{ base: 12, sm: 6 }}
                                                                    >
                                                                        <Select
                                                                            id={`variation-staff-${index}`}
                                                                            label="Staff Member"
                                                                            placeholder="Select a staff member"
                                                                            required
                                                                            data={availableStaffs.map(
                                                                                (staff) => ({
                                                                                    value: staff.id,
                                                                                    label: `${staff.name} (${staff.position || 'Stylist'})`,
                                                                                })
                                                                            )}
                                                                            value={item.staffId}
                                                                            onChange={(val) => {
                                                                                if (val) {
                                                                                    form.setFieldValue(
                                                                                        `pricingVariations.${index}.staffId`,
                                                                                        val
                                                                                    );
                                                                                }
                                                                            }}
                                                                            styles={{
                                                                                label: labelStyles,
                                                                            }}
                                                                        />
                                                                    </Grid.Col>
                                                                    <Grid.Col
                                                                        span={{ base: 9, sm: 4 }}
                                                                    >
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
                                                                                    typeof val ===
                                                                                        'number'
                                                                                        ? val
                                                                                        : 0
                                                                                );
                                                                            }}
                                                                            styles={{
                                                                                label: labelStyles,
                                                                            }}
                                                                        />
                                                                    </Grid.Col>
                                                                    <Grid.Col
                                                                        span={{ base: 3, sm: 2 }}
                                                                    >
                                                                        <Button
                                                                            variant="light"
                                                                            color="red"
                                                                            fullWidth
                                                                            onClick={() => {
                                                                                const updated = [
                                                                                    ...(form.values
                                                                                        .pricingVariations ||
                                                                                        []),
                                                                                ];
                                                                                updated.splice(
                                                                                    index,
                                                                                    1
                                                                                );
                                                                                form.setFieldValue(
                                                                                    'pricingVariations',
                                                                                    updated
                                                                                );
                                                                            }}
                                                                            className="h-[36px] flex items-center justify-center p-0"
                                                                        >
                                                                            <HiOutlineTrash
                                                                                size={18}
                                                                            />
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
                                                                            checked={
                                                                                item.enableCoupons
                                                                            }
                                                                            onChange={(event) => {
                                                                                const checked =
                                                                                    event
                                                                                        .currentTarget
                                                                                        .checked;
                                                                                form.setFieldValue(
                                                                                    `pricingVariations.${index}.enableCoupons`,
                                                                                    checked
                                                                                );
                                                                                if (
                                                                                    checked &&
                                                                                    (!item.coupons ||
                                                                                        item.coupons
                                                                                            .length ===
                                                                                            0)
                                                                                ) {
                                                                                    const firstAvailable =
                                                                                        activeCoupons[0];
                                                                                    const nextCouponId =
                                                                                        firstAvailable
                                                                                            ? firstAvailable.id
                                                                                            : '';
                                                                                    form.setFieldValue(
                                                                                        `pricingVariations.${index}.coupons`,
                                                                                        [
                                                                                            {
                                                                                                couponId:
                                                                                                    nextCouponId,
                                                                                                amount: 0,
                                                                                            },
                                                                                        ]
                                                                                    );
                                                                                }
                                                                            }}
                                                                        />

                                                                        {item.enableCoupons && (
                                                                            <Stack
                                                                                gap="xs"
                                                                                className="mt-2 pl-4 border-l-2 border-indigo-50"
                                                                            >
                                                                                {item.coupons &&
                                                                                item.coupons
                                                                                    .length > 0 ? (
                                                                                    <div className="flex flex-col gap-2">
                                                                                        {item.coupons.map(
                                                                                            (
                                                                                                cItem,
                                                                                                cIndex
                                                                                            ) => {
                                                                                                const selectedCouponIdsForStaff =
                                                                                                    item.coupons
                                                                                                        ?.map(
                                                                                                            (
                                                                                                                c
                                                                                                            ) =>
                                                                                                                c.couponId
                                                                                                        )
                                                                                                        .filter(
                                                                                                            (
                                                                                                                id
                                                                                                            ) =>
                                                                                                                id !==
                                                                                                                cItem.couponId
                                                                                                        ) ||
                                                                                                    [];
                                                                                                const availableCouponsForStaff =
                                                                                                    activeCoupons.filter(
                                                                                                        (
                                                                                                            c
                                                                                                        ) =>
                                                                                                            !selectedCouponIdsForStaff.includes(
                                                                                                                c.id
                                                                                                            )
                                                                                                    );

                                                                                                return (
                                                                                                    <Grid
                                                                                                        key={
                                                                                                            cIndex
                                                                                                        }
                                                                                                        align="flex-end"
                                                                                                        gap="md"
                                                                                                    >
                                                                                                        <Grid.Col
                                                                                                            span={{
                                                                                                                base: 12,
                                                                                                                sm: 6,
                                                                                                            }}
                                                                                                        >
                                                                                                            <Select
                                                                                                                id={`variation-coupon-select-${index}-${cIndex}`}
                                                                                                                label="Coupon Code"
                                                                                                                placeholder="Select a coupon"
                                                                                                                required
                                                                                                                data={availableCouponsForStaff.map(
                                                                                                                    (
                                                                                                                        c
                                                                                                                    ) => ({
                                                                                                                        value: c.id,
                                                                                                                        label: c.code,
                                                                                                                    })
                                                                                                                )}
                                                                                                                value={
                                                                                                                    cItem.couponId
                                                                                                                }
                                                                                                                onChange={(
                                                                                                                    val
                                                                                                                ) => {
                                                                                                                    if (
                                                                                                                        val
                                                                                                                    ) {
                                                                                                                        form.setFieldValue(
                                                                                                                            `pricingVariations.${index}.coupons.${cIndex}.couponId`,
                                                                                                                            val
                                                                                                                        );
                                                                                                                    }
                                                                                                                }}
                                                                                                                styles={{
                                                                                                                    label: labelStyles,
                                                                                                                }}
                                                                                                            />
                                                                                                        </Grid.Col>
                                                                                                        <Grid.Col
                                                                                                            span={{
                                                                                                                base: 9,
                                                                                                                sm: 4,
                                                                                                            }}
                                                                                                        >
                                                                                                            <NumberInput
                                                                                                                id={`variation-coupon-amount-${index}-${cIndex}`}
                                                                                                                label="Discount Price / Value ($)"
                                                                                                                placeholder="e.g. 10"
                                                                                                                min={
                                                                                                                    1
                                                                                                                }
                                                                                                                allowDecimal={
                                                                                                                    false
                                                                                                                }
                                                                                                                hideControls
                                                                                                                required
                                                                                                                value={
                                                                                                                    cItem.amount
                                                                                                                }
                                                                                                                onChange={(
                                                                                                                    val
                                                                                                                ) => {
                                                                                                                    form.setFieldValue(
                                                                                                                        `pricingVariations.${index}.coupons.${cIndex}.amount`,
                                                                                                                        typeof val ===
                                                                                                                            'number'
                                                                                                                            ? val
                                                                                                                            : 0
                                                                                                                    );
                                                                                                                }}
                                                                                                                styles={{
                                                                                                                    label: labelStyles,
                                                                                                                }}
                                                                                                            />
                                                                                                        </Grid.Col>
                                                                                                        <Grid.Col
                                                                                                            span={{
                                                                                                                base: 3,
                                                                                                                sm: 2,
                                                                                                            }}
                                                                                                        >
                                                                                                            <Button
                                                                                                                variant="light"
                                                                                                                color="red"
                                                                                                                fullWidth
                                                                                                                disabled={
                                                                                                                    item
                                                                                                                        .coupons
                                                                                                                        .length ===
                                                                                                                    1
                                                                                                                }
                                                                                                                onClick={() => {
                                                                                                                    const updatedCoupons =
                                                                                                                        [
                                                                                                                            ...(item.coupons ||
                                                                                                                                []),
                                                                                                                        ];
                                                                                                                    updatedCoupons.splice(
                                                                                                                        cIndex,
                                                                                                                        1
                                                                                                                    );
                                                                                                                    form.setFieldValue(
                                                                                                                        `pricingVariations.${index}.coupons`,
                                                                                                                        updatedCoupons
                                                                                                                    );
                                                                                                                }}
                                                                                                                className="h-[36px] flex items-center justify-center p-0"
                                                                                                            >
                                                                                                                <HiOutlineTrash
                                                                                                                    size={
                                                                                                                        18
                                                                                                                    }
                                                                                                                />
                                                                                                            </Button>
                                                                                                        </Grid.Col>
                                                                                                    </Grid>
                                                                                                );
                                                                                            }
                                                                                        )}
                                                                                    </div>
                                                                                ) : (
                                                                                    <span className="text-center p-6 text-sm text-gray-600 bg-gray-50 rounded border border-dashed border-gray-200">
                                                                                        No coupons
                                                                                        configured
                                                                                        for this
                                                                                        staff. Click
                                                                                        below to add
                                                                                        one.
                                                                                    </span>
                                                                                )}

                                                                                <Button
                                                                                    variant="outline"
                                                                                    color="indigo"
                                                                                    size="xs"
                                                                                    disabled={
                                                                                        item.coupons &&
                                                                                        item.coupons
                                                                                            .length >=
                                                                                            activeCoupons.length
                                                                                    }
                                                                                    onClick={() => {
                                                                                        const selectedCouponIdsForStaff =
                                                                                            item.coupons?.map(
                                                                                                (
                                                                                                    c
                                                                                                ) =>
                                                                                                    c.couponId
                                                                                            ) || [];
                                                                                        const firstAvailable =
                                                                                            activeCoupons.find(
                                                                                                (
                                                                                                    c
                                                                                                ) =>
                                                                                                    !selectedCouponIdsForStaff.includes(
                                                                                                        c.id
                                                                                                    )
                                                                                            );
                                                                                        const nextCouponId =
                                                                                            firstAvailable
                                                                                                ? firstAvailable.id
                                                                                                : '';
                                                                                        const currentCoupons =
                                                                                            item.coupons ||
                                                                                            [];
                                                                                        form.setFieldValue(
                                                                                            `pricingVariations.${index}.coupons`,
                                                                                            [
                                                                                                ...currentCoupons,
                                                                                                {
                                                                                                    couponId:
                                                                                                        nextCouponId,
                                                                                                    amount: 0,
                                                                                                },
                                                                                            ]
                                                                                        );
                                                                                    }}
                                                                                    className="mt-1 self-start w-fit"
                                                                                >
                                                                                    Add Coupon
                                                                                </Button>
                                                                            </Stack>
                                                                        )}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        );
                                                    }
                                                )}
                                            </div>
                                        ) : (
                                            <span className="text-center p-6 text-sm text-gray-600 flex items-center justify-center bg-gray-50 rounded-lg border border-dashed border-gray-200">
                                                No staff-specific pricing configured. This service
                                                will use the base price for all staff.
                                            </span>
                                        )}
                                        <Button
                                            variant="outline"
                                            color="indigo"
                                            size="sm"
                                            disabled={
                                                form.values.pricingVariations &&
                                                form.values.pricingVariations.length >=
                                                    allStaffs.length
                                            }
                                            onClick={() => {
                                                const selectedStaffIds =
                                                    form.values.pricingVariations?.map(
                                                        (v) => v.staffId
                                                    ) || [];
                                                const firstAvailableStaff = allStaffs.find(
                                                    (staff) => !selectedStaffIds.includes(staff.id)
                                                );

                                                const nextStaffId = firstAvailableStaff
                                                    ? firstAvailableStaff.id
                                                    : '';
                                                const currentVariations =
                                                    form.values.pricingVariations || [];
                                                form.setFieldValue('pricingVariations', [
                                                    ...currentVariations,
                                                    {
                                                        staffId: nextStaffId,
                                                        price: form.values.price || 0,
                                                        enableCoupons: false,
                                                        coupons: [],
                                                    },
                                                ]);
                                            }}
                                            className="mt-2 self-start w-fit"
                                        >
                                            Add Pricing Variation
                                        </Button>
                                    </Stack>
                                </Card>
                            )}

                            <div className="flex justify-end gap-3">
                                <Link href="/admin/services">
                                    <Button variant="default" size="md" disabled={isMutating}>
                                        Cancel
                                    </Button>
                                </Link>
                                <Button type="submit" size="md" loading={isMutating}>
                                    {isNew ? 'Create Service' : 'Save Changes'}
                                </Button>
                            </div>
                        </Stack>
                    </Grid.Col>
                </Grid>
            </form>
        </div>
    );
}
