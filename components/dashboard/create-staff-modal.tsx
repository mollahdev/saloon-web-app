'use client';
import {
    Button,
    Modal,
    TextInput,
    Textarea,
    Select,
    Stack,
    Text,
    Group,
    Divider,
} from '@mantine/core';
import { useEffect } from 'react';
import { schemaResolver, useForm } from '@mantine/form';
import toast from 'react-hot-toast';
import { useCreateStaffMutation, useUpdateStaffMutation } from '@/app/lib/store/staffs/api';
import { createStaffSchema, CreateStaffValues } from '@/app/lib/validation/staff';
import { Profile } from '@/models/profile';

interface CreateStaffModalProps {
    opened: boolean;
    onClose: () => void;
    staff?: Profile | null;
}

const labelStyles = {
    fontSize: 11,
    fontWeight: 700,
    textTransform: 'uppercase' as const,
    color: 'var(--mantine-color-gray-5)',
    marginBottom: 4,
};

export default function CreateStaffModal({ opened, onClose, staff }: CreateStaffModalProps) {
    const [createStaff, { isLoading: isCreating }] = useCreateStaffMutation();
    const [updateStaff, { isLoading: isUpdating }] = useUpdateStaffMutation();
    const isLoading = isCreating || isUpdating;

    const form = useForm<CreateStaffValues>({
        initialValues: {
            name: '',
            email: '',
            position: 'Barber/Stylist',
            role: 'MEMBER',
            bio: '',
        },
        validate: schemaResolver(createStaffSchema),
    });

    useEffect(() => {
        if (opened) {
            if (staff) {
                form.setValues({
                    name: staff.name || '',
                    email: staff.email || '',
                    position: staff.position || 'Barber/Stylist',
                    role: staff.role === 'OWNER' ? 'ADMIN' : staff.role || 'MEMBER',
                    bio: staff.bio || '',
                });
            } else {
                form.reset();
            }
        }
    }, [staff, opened, form]);

    const handleFormSubmit = async (values: CreateStaffValues) => {
        try {
            if (staff) {
                const body = {
                    name: values.name,
                    email: values.email,
                    position: values.position,
                    bio: values.bio,
                    role: values.role,
                    status: staff.status,
                    phone: staff.phone,
                    address: staff.address,
                    avatar: staff.avatar,
                };
                const response = await updateStaff({ id: staff.id, body }).unwrap();
                toast.success(response.message || 'Staff member updated successfully');
            } else {
                const response = await createStaff(values).unwrap();
                toast.success(response.message || 'Staff member created successfully');
            }
            onClose();
            form.reset();
        } catch (error: any) {
            toast.error(error?.data?.message || 'Failed to save staff member');
        }
    };

    const handleClose = () => {
        onClose();
        form.reset();
    };

    return (
        <Modal
            opened={opened}
            onClose={handleClose}
            title={
                <Text fw={700} size="lg">
                    {staff ? 'Edit Staff Member' : 'Create Staff Member'}
                </Text>
            }
            size="md"
            radius="lg"
            centered
        >
            <form onSubmit={form.onSubmit(handleFormSubmit)} noValidate>
                <Stack gap="md">
                    <TextInput
                        id="staff-name"
                        label="Full Name"
                        placeholder="e.g. John Doe"
                        required
                        {...form.getInputProps('name')}
                        styles={{ label: labelStyles }}
                    />

                    <TextInput
                        id="staff-email"
                        label="Email Address"
                        placeholder="e.g. john@example.com"
                        type="email"
                        required
                        {...form.getInputProps('email')}
                        styles={{ label: labelStyles }}
                    />

                    <TextInput
                        id="staff-position"
                        label="Position"
                        placeholder="e.g. Senior Barber, Hair Colorist"
                        {...form.getInputProps('position')}
                        styles={{ label: labelStyles }}
                    />

                    <Select
                        id="staff-role"
                        label="Role"
                        placeholder="Select a role"
                        data={[
                            { value: 'MEMBER', label: 'Member (Standard staff)' },
                            { value: 'ADMIN', label: 'Admin (Manage saloon settings)' },
                        ]}
                        {...form.getInputProps('role')}
                        styles={{ label: labelStyles }}
                    />

                    <Textarea
                        id="staff-bio"
                        label="Biography (Optional)"
                        placeholder="Write a short bio about their specialty, experience..."
                        minRows={3}
                        {...form.getInputProps('bio')}
                        styles={{ label: labelStyles }}
                    />

                    <Divider my="xs" />

                    <Group justify="flex-end" gap="sm">
                        <Button variant="default" onClick={handleClose} disabled={isLoading}>
                            Cancel
                        </Button>
                        <Button type="submit" loading={isLoading}>
                            {staff ? 'Save Changes' : 'Create Staff'}
                        </Button>
                    </Group>
                </Stack>
            </form>
        </Modal>
    );
}
