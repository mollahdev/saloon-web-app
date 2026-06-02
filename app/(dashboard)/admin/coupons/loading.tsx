'use client';
import { Skeleton, SimpleGrid, Card, Stack, Group, Divider } from '@mantine/core';

export default function CouponsLoading() {
    return (
        <div className="max-w-[1300px] mx-auto w-full px-4 md:px-0">
            <SimpleGrid cols={{ base: 1, sm: 2, lg: 3, xl: 4 }} spacing="lg" verticalSpacing="lg">
                {[...Array(8)].map((_, i) => (
                    <Card key={i} padding="xl" radius="md" withBorder>
                        <Stack gap="sm" className="h-full justify-between">
                            <div>
                                <Group
                                    justify="space-between"
                                    align="flex-start"
                                    wrap="nowrap"
                                    mb={12}
                                >
                                    <Skeleton height={20} width="60%" />
                                    <Skeleton height={20} width="20%" />
                                </Group>
                                <Skeleton height={14} width="100%" mb={8} />
                                <Skeleton height={14} width="85%" mb={8} />
                                <Skeleton height={14} width="40%" mb={16} />
                            </div>

                            <Group gap="xs" mt="xs">
                                <Skeleton height={24} width={80} radius="xl" />
                            </Group>
                        </Stack>

                        <Divider my="md" variant="dashed" />

                        <Group justify="center" gap="md">
                            <Skeleton height={36} width="80%" radius="sm" />
                            <Skeleton height={36} width={36} radius="sm" />
                        </Group>
                    </Card>
                ))}
            </SimpleGrid>
        </div>
    );
}
