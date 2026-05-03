'use client';
import { Skeleton, Divider, Group, Stack } from '@mantine/core';

export default function WorkingHoursLoading() {
    return (
        <>
            <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg border border-gray-100">
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
        </>
    );
}
