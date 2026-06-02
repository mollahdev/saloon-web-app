'use client';
import {
    Button,
    Modal,
    TextInput,
    Textarea,
    NumberInput,
    Stack,
    Text,
    Group,
    Divider,
} from '@mantine/core';
import { useEffect } from 'react';
import { schemaResolver, useForm } from '@mantine/form';
import toast from 'react-hot-toast';
import { useCreateServiceMutation, useUpdateServiceMutation } from '@/app/lib/store/services/api';
import { serviceSchema, ServiceValues } from '@/app/lib/validation/service';
import { Service } from '@/models/service';

interface CreateServiceModalProps {
    opened: boolean;
    onClose: () => void;
    service?: Service | null;
}

const labelStyles = {
    fontSize: 11,
    fontWeight: 700,
    textTransform: 'uppercase' as const,
    color: 'var(--mantine-color-gray-5)',
    marginBottom: 4,
};

export default function CreateServiceModal({ opened, onClose, service }: CreateServiceModalProps) {
    const [createService, { isLoading: isCreating }] = useCreateServiceMutation();
    const [updateService, { isLoading: isUpdating }] = useUpdateServiceMutation();
    const isLoading = isCreating || isUpdating;

    const form = useForm<ServiceValues>({
        initialValues: {
            name: '',
            description: '',
            price: 0,
            duration: 0,
        },
        validate: schemaResolver(serviceSchema),
    });

    useEffect(() => {
        if (opened) {
            if (service) {
                form.setValues({
                    name: service.name || '',
                    description: service.description || '',
                    price: service.price || 0,
                    duration: service.duration || 0,
                });
            } else {
                form.reset();
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [service, opened]);

    const handleFormSubmit = async (values: ServiceValues) => {
        try {
            if (service) {
                const response = await updateService({ id: service.id, body: values }).unwrap();
                toast.success(response.message || 'Service updated successfully');
            } else {
                const response = await createService(values).unwrap();
                toast.success(response.message || 'Service created successfully');
            }
            onClose();
            form.reset();
        } catch {
            // Error is handled globally by rtkErrorMiddleware
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
                    {service ? 'Edit Service' : 'Create Service'}
                </Text>
            }
            size="md"
            radius="lg"
            centered
        >
            <form onSubmit={form.onSubmit(handleFormSubmit)} noValidate>
                <Stack gap="md">
                    <TextInput
                        id="service-name"
                        label="Service Name"
                        placeholder="e.g. Premium Haircut"
                        required
                        {...form.getInputProps('name')}
                        styles={{ label: labelStyles }}
                    />

                    <NumberInput
                        id="service-price"
                        label="Price ($)"
                        placeholder="e.g. 45.00"
                        min={0.01}
                        decimalScale={2}
                        fixedDecimalScale
                        hideControls
                        required
                        {...form.getInputProps('price')}
                        styles={{ label: labelStyles }}
                    />

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

                    <Textarea
                        id="service-description"
                        label="Description (Optional)"
                        placeholder="Describe what the service includes..."
                        minRows={3}
                        {...form.getInputProps('description')}
                        styles={{ label: labelStyles }}
                    />

                    <Divider my="xs" />

                    <Group justify="flex-end" gap="sm">
                        <Button variant="default" onClick={handleClose} disabled={isLoading}>
                            Cancel
                        </Button>
                        <Button type="submit" loading={isLoading}>
                            {service ? 'Save Changes' : 'Create Service'}
                        </Button>
                    </Group>
                </Stack>
            </form>
        </Modal>
    );
}
