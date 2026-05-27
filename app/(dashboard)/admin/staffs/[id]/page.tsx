'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
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
    Center,
    Switch,
} from '@mantine/core';
import { schemaResolver, useForm } from '@mantine/form';
import toast from 'react-hot-toast';
import { HiOutlineArrowLeft } from 'react-icons/hi';

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

const presetAvatars = [
    'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-1.png',
    'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-2.png',
    'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-3.png',
    'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-4.png',
    'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-5.png',
    'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-6.png',
    'https://static.vecteezy.com/system/resources/previews/052/523/015/non_2x/3d-icon-avatar-cartoon-character-smiling-man-learning-people-close-up-portrait-on-isolated-on-transparent-background-png.png',
];

const labelStyles = {
    fontSize: 11,
    fontWeight: 700,
    textTransform: 'uppercase' as const,
    color: 'var(--mantine-color-gray-5)',
    marginBottom: 4,
};

export default function StaffDetailPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;

    const { data: staffResponse, isLoading, error } = useGetStaffQuery(id);
    const staff = staffResponse?.data;
    const [updateStaff, { isLoading: isUpdating }] = useUpdateStaffMutation();
    const [sendResetLink, { isLoading: isSendingReset }] = useSendResetPasswordLinkMutation();

    const handleSendResetLink = async () => {
        try {
            const response = await sendResetLink(id).unwrap();
            toast.success(response.message || 'Reset password link sent successfully');
        } catch (error: any) {
            toast.error(error?.data?.message || 'Failed to send reset password link');
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
    }, [staff, form]);

    if (isLoading) {
        return (
            <Center style={{ minHeight: '400px' }}>
                <Text size="lg" fw={500} c="dimmed">
                    Loading staff details...
                </Text>
            </Center>
        );
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
            router.push('/admin/staffs');
        } catch (error: any) {
            toast.error(error?.data?.message || 'Failed to update staff member');
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
                                    <div className="relative">
                                        <Avatar
                                            src={form.values.avatar || staff.avatar}
                                            size={120}
                                            radius={120}
                                            className="border-4 border-gray-50 shadow-md"
                                        />
                                        <div
                                            className={`absolute bottom-1 right-1 w-5 h-5 rounded-full border-4 border-white ${
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

                            <Card withBorder radius="lg" className="bg-white p-6 shadow-sm">
                                <Text fw={700} size="sm" mb="md" styles={{ root: labelStyles }}>
                                    Avatar Customization
                                </Text>

                                <Stack gap="md">
                                    {/* Presets */}
                                    <div>
                                        <Text size="xs" fw={600} c="dimmed" mb="xs">
                                            Select Preset Avatar
                                        </Text>
                                        <Group gap="xs" justify="flex-start">
                                            {presetAvatars.map((url, idx) => (
                                                <button
                                                    key={idx}
                                                    type="button"
                                                    onClick={() =>
                                                        form.setFieldValue('avatar', url)
                                                    }
                                                    className={`relative p-0.5 rounded-full border-2 transition-all hover:scale-105 ${
                                                        form.values.avatar === url
                                                            ? 'border-blue-500 scale-105 shadow-sm'
                                                            : 'border-transparent'
                                                    }`}
                                                >
                                                    <Avatar src={url} size={40} radius="xl" />
                                                </button>
                                            ))}
                                        </Group>
                                    </div>

                                    <TextInput
                                        label="Custom Avatar URL"
                                        placeholder="Paste custom image URL..."
                                        {...form.getInputProps('avatar')}
                                        styles={{ label: labelStyles }}
                                    />
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
