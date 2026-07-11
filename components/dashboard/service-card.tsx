'use client';
import {
    Card,
    Stack,
    Group,
    Text,
    Divider,
    Tooltip,
    ActionIcon,
    Button,
    Badge,
} from '@mantine/core';
import { HiOutlineTrash, HiOutlineClock } from 'react-icons/hi';
import { Service } from '@/models/service';
import { useConfirmation } from '@/hooks/use-confirmation';
import { useDeleteServiceMutation } from '@/app/lib/store/services/api';
import toast from 'react-hot-toast';
import Link from 'next/link';

const DEFAULT_SALOON_IMAGE = '/placeholder.svg';

interface ServiceCardProps {
    service: Service;
}

export function ServiceCard({ service }: ServiceCardProps) {
    const { confirm } = useConfirmation();
    const [deleteService] = useDeleteServiceMutation();

    const handleDeleteClick = () => {
        confirm({
            title: 'Delete Service',
            message: `Are you sure you want to delete the service "${service.name}"? This action cannot be undone.`,
            confirmLabel: 'Delete',
            color: 'red',
            onConfirm: async () => {
                try {
                    await deleteService(service.id).unwrap();
                    toast.success('Service deleted successfully');
                } catch {
                    // Handled globally by rtkErrorMiddleware
                }
            },
        });
    };

    return (
        <Card
            padding="xl"
            radius="md"
            className={`relative transition-all duration-200 border border-gray-100 overflow-hidden bg-white group flex flex-col h-full justify-between ${
                service.status === 'INACTIVE' ? 'opacity-80 hover:opacity-100' : ''
            }`}
        >
            <Card.Section className="h-44 overflow-hidden relative">
                <img
                    src={service.image || DEFAULT_SALOON_IMAGE}
                    alt={service.name}
                    className="w-full h-full object-cover transition-transform duration-300"
                />
            </Card.Section>

            <Stack gap="sm" className="relative z-10 flex-grow mt-4">
                <div>
                    <Group justify="space-between" align="flex-start" wrap="nowrap">
                        <Text className="text-lg font-bold text-gray-800 tracking-tight leading-snug">
                            {service.name}
                        </Text>
                        <Text className="text-lg font-extrabold text-indigo-600 shrink-0">
                            ${Math.round(service.price)}
                        </Text>
                    </Group>
                </div>

                <Text className="text-sm font-medium text-gray-500 line-clamp-3 mb-2 flex-grow">
                    {service.description || 'No description provided.'}
                </Text>

                <Group gap="xs" className="mt-auto">
                    <Badge
                        color="indigo"
                        variant="light"
                        size="md"
                        leftSection={<HiOutlineClock size={14} className="mt-0.5" />}
                        className="font-semibold px-2.5 py-3 h-auto"
                    >
                        {service.duration} mins
                    </Badge>
                    <Badge
                        color={service.status === 'ACTIVE' ? 'teal' : 'orange'}
                        variant="light"
                        size="md"
                        className="font-semibold px-2.5 py-3 h-auto"
                    >
                        {service.status === 'ACTIVE' ? 'Active' : 'Inactive'}
                    </Badge>
                </Group>
            </Stack>

            <Divider my="md" variant="dashed" className="opacity-60" />

            <div className="flex flex-row items-center gap-1.5 w-full mt-auto">
                <Button
                    component={Link}
                    href={`/admin/services/${service.id}`}
                    variant="light"
                    color="blue"
                    size="sm"
                    fullWidth
                    className="h-9 transition-all hover:bg-blue-100 font-bold text-[13px]"
                >
                    Edit Service
                </Button>

                <Tooltip label="Delete Service" withArrow>
                    <ActionIcon
                        variant="light"
                        color="red"
                        size="lg"
                        className="h-9 w-9 transition-colors duration-200 hover:bg-red-100 shrink-0"
                        onClick={handleDeleteClick}
                    >
                        <HiOutlineTrash size={18} strokeWidth={1.5} />
                    </ActionIcon>
                </Tooltip>
            </div>
        </Card>
    );
}
