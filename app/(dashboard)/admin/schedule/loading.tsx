'use client';
import { Skeleton, Divider, Group, Stack } from '@mantine/core';

export default function ScheduleLoading() {
    return (
        <div className="max-w-3xl w-full">
            {/* Header skeleton */}
            <div className="flex flex-col gap-1 mb-6">
                <Skeleton height={32} width="60%" mb={8} className="max-w-[240px]" />
                <Skeleton height={14} width="90%" className="max-w-[340px]" />
            </div>

            <Group gap="sm" className="mb-6 overflow-hidden flex-nowrap">
                <Skeleton height={36} width={120} radius="md" className="shrink-0" />
                <Skeleton height={36} width={130} radius="md" className="shrink-0" />
            </Group>

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
