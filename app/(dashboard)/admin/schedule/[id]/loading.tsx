'use client';
import { Skeleton, Divider, Group, Stack, ActionIcon } from '@mantine/core';
import { HiOutlineArrowLeft } from 'react-icons/hi';

export default function ScheduleLoading() {
    return (
        <div className="max-w-3xl mx-auto w-full">
            {/* Header skeleton */}
            <div className="flex items-center gap-4 mb-6">
                <ActionIcon variant="subtle" color="gray" size="lg" disabled>
                    <HiOutlineArrowLeft size={20} />
                </ActionIcon>
                <div className="flex items-center gap-3">
                    <Skeleton height={44} width={44} circle />
                    <div>
                        <Skeleton height={20} width={160} mb={6} />
                        <Skeleton height={14} width={100} />
                    </div>
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <Stack gap="xl">
                    {[...Array(7)].map((_, i) => (
                        <div key={i}>
                            <Group justify="space-between" align="center">
                                <Group gap="md">
                                    <Skeleton height={20} width={100} />
                                    <Skeleton height={28} width={50} radius="xl" />
                                </Group>
                                <Group gap="md">
                                    <Skeleton height={42} width={120} radius="sm" />
                                    <Skeleton height={42} width={120} radius="sm" />
                                </Group>
                            </Group>
                            {i < 6 && <Divider mt="md" />}
                        </div>
                    ))}
                </Stack>
                <Divider my="xl" />
                <div className="flex justify-end">
                    <Skeleton height={42} width={140} radius="sm" />
                </div>
            </div>
        </div>
    );
}
