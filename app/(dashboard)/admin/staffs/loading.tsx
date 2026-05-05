'use client';
import { Skeleton, SimpleGrid, Card, Stack, Group, Divider } from '@mantine/core';

export default function StaffsLoading() {
    return (
        <div className="max-w-[1600px] mx-auto w-full px-4 md:px-0">
            <SimpleGrid cols={{ base: 1, sm: 2, lg: 3, xl: 4 }} spacing="lg" verticalSpacing="lg">
                {[...Array(8)].map((_, i) => (
                    <Card key={i} padding="xl" radius="md" withBorder>
                        <Stack align="center" gap="sm">
                            <Skeleton height={80} circle />

                            <div
                                style={{
                                    width: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                }}
                            >
                                <Skeleton height={20} width="60%" mb={8} />
                                <Skeleton height={14} width="40%" />
                            </div>

                            <Group gap="xs" mt="xs">
                                <Skeleton height={24} width={60} radius="xl" />
                                <Skeleton height={24} width={80} radius="xl" />
                            </Group>
                        </Stack>

                        <Divider my="md" variant="dashed" />

                        <Group justify="center" gap="md">
                            <Skeleton height={36} width={36} radius="sm" />
                            <Skeleton height={36} width={36} radius="sm" />
                            <Skeleton height={36} width={36} radius="sm" />
                        </Group>
                    </Card>
                ))}
            </SimpleGrid>
        </div>
    );
}
