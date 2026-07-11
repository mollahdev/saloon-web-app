'use client';

import { useEffect, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button, Divider, Grid, Card, Text, Stack, Loader, Switch } from '@mantine/core';
import { schemaResolver, useForm } from '@mantine/form';
import toast from 'react-hot-toast';
import { HiOutlineArrowLeft } from 'react-icons/hi';
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
import { ServiceImageUploader } from './service-image-uploader';
import { ServiceDetailsForm } from './service-details-form';
import { CouponList } from './coupon-list';
import { PricingVariationsCard } from './pricing-variations-card';

export default function EditServicePage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;
    const isNew = id === 'new';

    const { data: serviceResponse, isLoading, error } = useGetServiceQuery(id, { skip: isNew });
    const service = serviceResponse?.data;

    const { data: staffsResponse } = useGetStaffsQuery();
    const allStaffs = staffsResponse?.data || [];

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
                            <ServiceImageUploader
                                imageUrl={form.values.image}
                                name={form.values.name}
                                price={form.values.price}
                                duration={form.values.duration}
                                status={form.values.status}
                                isUploadingImage={isUploadingImage}
                                fileInputRef={fileInputRef}
                                onUpload={handleUpload}
                                onRemoveImage={handleRemoveImage}
                            />
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

                                <ServiceDetailsForm form={form} />

                                {/* Coupon Settings Toggle & Inputs for Base Price */}
                                {activeCoupons.length > 0 && (
                                    <div className="mt-4">
                                        <Divider
                                            label="Coupon Settings"
                                            labelPosition="left"
                                            mb="md"
                                        />
                                        <Switch
                                            id="enable-coupons"
                                            label="Enable Coupons for Base Price"
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
                                            <CouponList
                                                coupons={form.values.coupons || []}
                                                activeCoupons={activeCoupons}
                                                fieldPath="coupons"
                                                onSetFieldValue={form.setFieldValue}
                                                emptyMessage="No coupons configured for base price. Click below to add one."
                                            />
                                        )}
                                    </div>
                                )}
                            </Card>

                            {/* Pricing Variations Card */}
                            <PricingVariationsCard
                                form={form}
                                allStaffs={allStaffs}
                                activeCoupons={activeCoupons}
                            />

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
