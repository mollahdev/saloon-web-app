'use client';

import { useEffect, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
    Button,
    Divider,
    TextInput,
    Textarea,
    Select,
    Grid,
    Card,
    Text,
    Avatar,
    Group,
    Stack,
    Badge,
    Switch,
    Loader,
} from '@mantine/core';
import { schemaResolver, useForm } from '@mantine/form';
import toast from 'react-hot-toast';
import { HiOutlineArrowLeft, HiOutlineUpload } from 'react-icons/hi';
import { useAppSelector } from '@/app/lib/store';

/**
 * Internal dependencies
 */
import { PageTitle } from '@/utils/portal';
import {
    useGetStaffQuery,
    useUpdateStaffMutation,
    useSendResetPasswordLinkMutation,
} from '@/app/lib/store/staffs/api';
import { updateStaffSchema, UpdateStaffValues } from '@/app/lib/validation/staff';
import { STATUS } from '@/constants';
import StaffDetailLoading from './loading';

const labelStyles = {
    fontSize: 11,
    fontWeight: 700,
    textTransform: 'uppercase' as const,
    color: 'var(--mantine-color-gray-5)',
    marginBottom: 4,
};

export default function StaffDetailPage() {
    const params = useParams();
    const id = params.id as string;

    const { data: staffResponse, isLoading, error } = useGetStaffQuery(id);
    const staff = staffResponse?.data;
    const [updateStaff, { isLoading: isUpdating }] = useUpdateStaffMutation();
    const [sendResetLink, { isLoading: isSendingReset }] = useSendResetPasswordLinkMutation();

    const accessToken = useAppSelector((state) => state.auth.accessToken);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isUploadingImage, setIsUploadingImage] = useState(false);

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
            form.setFieldValue('avatar', result.data.url);
            toast.success('Avatar uploaded successfully');
        } catch (error: any) {
            toast.error(error.message || 'Failed to upload avatar');
        } finally {
            setIsUploadingImage(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const handleSendResetLink = async () => {
        try {
            const response = await sendResetLink(id).unwrap();
            toast.success(response.message || 'Reset password link sent successfully');
        } catch {
            // Error is handled globally by rtkErrorMiddleware
        }
    };

    const form = useForm<UpdateStaffValues>({
        initialValues: {
            name: '',
            email: '',
            position: 'Barber/Stylist',
            bio: '',
            phone: '',
            address: '',
            avatar: '',
            role: 'MEMBER',
            status: 'PENDING_VERIFICATION',
            password: '',
        },
        validate: schemaResolver(updateStaffSchema),
    });

    useEffect(() => {
        if (staff) {
            form.setValues({
                name: staff.name || '',
                email: staff.email || '',
                position: staff.position || 'Barber/Stylist',
                bio: staff.bio || '',
                phone: staff.phone || '',
                address: staff.address || '',
                avatar: staff.avatar || '',
                role: staff.role === 'OWNER' ? 'ADMIN' : staff.role,
                status: staff.status || 'PENDING_VERIFICATION',
                password: '',
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [staff]);

    if (isLoading) {
        return <StaffDetailLoading />;
    }

    if (error || !staff) {
        return (
            <div className="max-w-xl mx-auto mt-10 text-center">
                <Card padding="xl" radius="md" withBorder>
                    <Text size="lg" fw={700} c="red" mb="md">
                        Failed to load staff member details.
                    </Text>
                    <Text size="sm" c="dimmed" mb="lg">
                        The staff member may not exist or you do not have permission to view them.
                    </Text>
                    <Link href="/admin/staffs">
                        <Button variant="outline">Back to Staffs</Button>
                    </Link>
                </Card>
            </div>
        );
    }

    const handleSubmit = async (values: UpdateStaffValues) => {
        try {
            const body = {
                ...values,
                // handle empty password fields safely
                password: values.password?.trim() === '' ? undefined : values.password,
            };
            const response = await updateStaff({ id, body }).unwrap();
            toast.success(response.message || 'Staff member details updated successfully');
        } catch {
            // Error is handled globally by rtkErrorMiddleware
        }
    };

    return (
        <div className="max-w-[1200px] mx-auto w-full pb-10">
            <PageTitle.Source>{`Staff: ${staff.name}`}</PageTitle.Source>

            {/* Top Navigation */}
            <div className="mb-6">
                <Link href="/admin/staffs">
                    <Button
                        variant="subtle"
                        color="gray"
                        leftSection={<HiOutlineArrowLeft size={16} />}
                        size="sm"
                    >
                        Back to Staffs
                    </Button>
                </Link>
            </div>

            <form onSubmit={form.onSubmit(handleSubmit)} noValidate>
                <Grid gap="xl">
                    {/* Left Panel: Profile Card & Avatar Presets */}
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
                                    <div className="relative group">
                                        {/* Hidden file input */}
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            onChange={handleUpload}
                                            accept="image/png,image/jpeg,image/gif,image/webp"
                                            style={{ display: 'none' }}
                                        />

                                        <div
                                            className={`relative rounded-full overflow-hidden border-4 border-gray-50 shadow-md transition-all hover:scale-102 active:scale-98 ${
                                                isUploadingImage ? 'opacity-80' : ''
                                            }`}
                                            style={{ width: 120, height: 120 }}
                                        >
                                            <Avatar
                                                src={form.values.avatar || staff.avatar}
                                                size={112}
                                                radius={112}
                                            />

                                            {/* Hover Overlay */}
                                            <div
                                                className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white cursor-pointer"
                                                onClick={() =>
                                                    !isUploadingImage &&
                                                    fileInputRef.current?.click()
                                                }
                                            >
                                                <HiOutlineUpload size={20} />
                                                <Text
                                                    size="10px"
                                                    fw={600}
                                                    style={{
                                                        textTransform: 'uppercase',
                                                        marginTop: 2,
                                                    }}
                                                >
                                                    Upload
                                                </Text>
                                            </div>

                                            {/* Loading Overlay */}
                                            {isUploadingImage && (
                                                <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white">
                                                    <Loader size="xs" color="white" />
                                                </div>
                                            )}
                                        </div>

                                        <div
                                            className={`absolute bottom-1 right-1 w-5 h-5 rounded-full border-4 border-white z-10 ${
                                                form.values.status === STATUS.ACTIVE
                                                    ? 'bg-teal-500'
                                                    : 'bg-gray-400'
                                            }`}
                                        />
                                    </div>

                                    <div className="text-center">
                                        <Text fw={700} size="lg">
                                            {form.values.name || 'Staff Member'}
                                        </Text>
                                        <Text size="sm" c="dimmed" fw={500}>
                                            {form.values.position || 'Stylist'}
                                        </Text>
                                    </div>

                                    <Group justify="center" gap="xs">
                                        <Badge color="blue" variant="light">
                                            {form.values.role}
                                        </Badge>
                                        <Badge
                                            color={
                                                form.values.status === STATUS.ACTIVE
                                                    ? 'teal'
                                                    : 'orange'
                                            }
                                            variant="dot"
                                        >
                                            {form.values.status}
                                        </Badge>
                                    </Group>
                                </Stack>
                            </Card>
                        </Stack>
                    </Grid.Col>

                    {/* Right Panel: Main Form Fields & Password */}
                    <Grid.Col span={{ base: 12, md: 8 }}>
                        <Stack gap="lg">
                            <Card withBorder radius="lg" className="bg-white p-6 shadow-sm">
                                <Text fw={700} size="md" mb="md" className="text-gray-800">
                                    Personal Details
                                </Text>
                                <Divider mb="lg" />

                                <Grid gap="md">
                                    <Grid.Col span={{ base: 12, sm: 6 }}>
                                        <TextInput
                                            id="staff-name"
                                            label="Full Name"
                                            placeholder="e.g. John Doe"
                                            required
                                            {...form.getInputProps('name')}
                                            styles={{ label: labelStyles }}
                                        />
                                    </Grid.Col>

                                    <Grid.Col span={{ base: 12, sm: 6 }}>
                                        <TextInput
                                            id="staff-email"
                                            label="Email Address"
                                            placeholder="e.g. john@example.com"
                                            required
                                            {...form.getInputProps('email')}
                                            styles={{ label: labelStyles }}
                                        />
                                    </Grid.Col>

                                    <Grid.Col span={{ base: 12, sm: 6 }}>
                                        <TextInput
                                            id="staff-phone"
                                            label="Phone Number"
                                            placeholder="e.g. +123456789"
                                            {...form.getInputProps('phone')}
                                            styles={{ label: labelStyles }}
                                        />
                                    </Grid.Col>

                                    <Grid.Col span={{ base: 12, sm: 6 }}>
                                        <TextInput
                                            id="staff-position"
                                            label="Position"
                                            placeholder="e.g. Master Stylist"
                                            required
                                            {...form.getInputProps('position')}
                                            styles={{ label: labelStyles }}
                                        />
                                    </Grid.Col>

                                    <Grid.Col span={{ base: 12 }}>
                                        <TextInput
                                            id="staff-address"
                                            label="Address"
                                            placeholder="e.g. 123 Main St, City"
                                            {...form.getInputProps('address')}
                                            styles={{ label: labelStyles }}
                                        />
                                    </Grid.Col>

                                    <Grid.Col span={{ base: 12 }}>
                                        <Textarea
                                            id="staff-bio"
                                            label="Bio"
                                            placeholder="Write a bio..."
                                            minRows={3}
                                            {...form.getInputProps('bio')}
                                            styles={{ label: labelStyles }}
                                        />
                                    </Grid.Col>
                                </Grid>
                            </Card>

                            <Card withBorder radius="lg" className="bg-white p-6 shadow-sm">
                                <Text fw={700} size="md" mb="md" className="text-gray-800">
                                    Administrative Settings
                                </Text>
                                <Divider mb="lg" />

                                <Grid gap="md" align="center">
                                    <Grid.Col span={{ base: 12, sm: 6 }}>
                                        <Select
                                            id="staff-role"
                                            label="Role"
                                            data={[
                                                { value: 'MEMBER', label: 'Member (Standard)' },
                                                { value: 'ADMIN', label: 'Admin (Full Access)' },
                                            ]}
                                            {...form.getInputProps('role')}
                                            styles={{ label: labelStyles }}
                                        />
                                    </Grid.Col>

                                    <Grid.Col
                                        span={{ base: 12, sm: 6 }}
                                        className="flex items-center"
                                    >
                                        <Switch
                                            id="staff-status"
                                            label="Active Account"
                                            size="md"
                                            className="mt-6"
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

                                    <Grid.Col span={{ base: 12 }} className="mt-4">
                                        <Divider label="Security" labelPosition="left" mb="md" />
                                        <Button
                                            variant="light"
                                            color="red"
                                            onClick={handleSendResetLink}
                                            loading={isSendingReset}
                                        >
                                            Send Reset Password Link
                                        </Button>
                                    </Grid.Col>
                                </Grid>
                            </Card>

                            <div className="flex justify-end gap-3">
                                <Link href="/admin/staffs">
                                    <Button variant="default" size="md">
                                        Cancel
                                    </Button>
                                </Link>
                                <Button type="submit" size="md" loading={isUpdating}>
                                    Save Changes
                                </Button>
                            </div>
                        </Stack>
                    </Grid.Col>
                </Grid>
            </form>
        </div>
    );
}
