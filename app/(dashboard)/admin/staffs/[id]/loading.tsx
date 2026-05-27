'use client';

import { Skeleton, Grid, Card, Stack, Group, Divider } from '@mantine/core';

export default function StaffDetailLoading() {
    return (
        <div className="max-w-[1200px] mx-auto w-full pb-10">
            {/* Top Navigation Skeleton */}
            <div className="mb-6">
                <Skeleton height={32} width={120} radius="sm" />
            </div>

            <Grid gap="xl">
                {/* Left Panel Skeleton */}
                <Grid.Col span={{ base: 12, md: 4 }}>
                    <Stack gap="lg">
                        <Card withBorder radius="lg" p="xl" className="bg-white">
                            <Stack align="center" gap="md">
                                <Skeleton height={120} circle />
                                <Skeleton height={20} width="60%" />
                                <Skeleton height={14} width="40%" />
                                <Group gap="xs">
                                    <Skeleton height={24} width={70} radius="xl" />
                                    <Skeleton height={24} width={90} radius="xl" />
                                </Group>
                            </Stack>
                        </Card>

                        <Card withBorder radius="lg" p="xl" className="bg-white">
                            <Skeleton height={16} width="40%" mb="md" />
                            <Stack gap="md">
                                <Group gap="xs">
                                    {[...Array(6)].map((_, i) => (
                                        <Skeleton key={i} height={40} width={40} circle />
                                    ))}
                                </Group>
                                <Skeleton height={36} width="100%" radius="sm" />
                            </Stack>
                        </Card>
                    </Stack>
                </Grid.Col>

                {/* Right Panel Skeleton */}
                <Grid.Col span={{ base: 12, md: 8 }}>
                    <Stack gap="lg">
                        <Card withBorder radius="lg" p="xl" className="bg-white">
                            <Skeleton height={20} width="30%" mb="sm" />
                            <Divider mb="lg" />
                            <Grid gap="md">
                                {[...Array(6)].map((_, i) => (
                                    <Grid.Col
                                        key={i}
                                        span={{ base: 12, sm: i === 4 || i === 5 ? 12 : 6 }}
                                    >
                                        <Skeleton height={36} width="100%" radius="sm" />
                                    </Grid.Col>
                                ))}
                            </Grid>
                        </Card>

                        <Card withBorder radius="lg" p="xl" className="bg-white">
                            <Skeleton height={20} width="45%" mb="sm" />
                            <Divider mb="lg" />
                            <Grid gap="md">
                                <Grid.Col span={6}>
                                    <Skeleton height={36} width="100%" radius="sm" />
                                </Grid.Col>
                                <Grid.Col span={6}>
                                    <Skeleton height={36} width="100%" radius="sm" />
                                </Grid.Col>
                            </Grid>
                        </Card>
                    </Stack>
                </Grid.Col>
            </Grid>
        </div>
    );
}
