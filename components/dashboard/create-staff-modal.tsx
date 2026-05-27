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
import { schemaResolver, useForm } from '@mantine/form';
import toast from 'react-hot-toast';
import { useCreateStaffMutation } from '@/app/lib/store/staffs/api';
import { createStaffSchema, CreateStaffValues } from '@/app/lib/validation/staff';

interface CreateStaffModalProps {
    opened: boolean;
    onClose: () => void;
}

const labelStyles = {
    fontSize: 11,
    fontWeight: 700,
    textTransform: 'uppercase' as const,
    color: 'var(--mantine-color-gray-5)',
    marginBottom: 4,
};

export default function CreateStaffModal({ opened, onClose }: CreateStaffModalProps) {
    const [createStaff, { isLoading }] = useCreateStaffMutation();

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

    const handleFormSubmit = async (values: CreateStaffValues) => {
        try {
            const response = await createStaff(values).unwrap();
            toast.success(response.message || 'Staff member created successfully');
            onClose();
            form.reset();
        } catch (error: any) {
            toast.error(error?.data?.message || 'Failed to create staff member');
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
                    Create Staff Member
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
                            Create Staff
                        </Button>
                    </Group>
                </Stack>
            </form>
        </Modal>
    );
}
