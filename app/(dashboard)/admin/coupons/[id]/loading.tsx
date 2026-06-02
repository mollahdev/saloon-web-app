'use client';
import { Skeleton, Stack, Grid, Card, Divider } from '@mantine/core';

export default function CouponDetailLoading() {
    return (
        <div className="max-w-[1200px] mx-auto w-full pb-10">
            {/* Top Navigation */}
            <div className="mb-6">
                <Skeleton height={32} width={120} radius="sm" />
            </div>

            <div className="mb-6">
                <Skeleton height={28} width="30%" mb={10} />
                <Skeleton height={14} width="50%" />
            </div>

            <Grid gap="xl">
                {/* Main Settings Panel Skeletons */}
                <Grid.Col span={{ base: 12, md: 8 }}>
                    <Stack gap="lg">
                        <Card withBorder radius="lg" className="bg-white p-6">
                            <Skeleton height={20} width={100} mb="md" />
                            <Divider mb="lg" />

                            <Grid gap="md">
                                <Grid.Col span={{ base: 12, sm: 6 }}>
                                    <Skeleton height={14} width={80} mb={6} />
                                    <Skeleton height={36} radius="sm" />
                                </Grid.Col>
                                <Grid.Col span={{ base: 12, sm: 6 }}>
                                    <Skeleton height={14} width={80} mb={6} />
                                    <Skeleton height={36} radius="sm" />
                                </Grid.Col>
                                <Grid.Col span={{ base: 12, sm: 6 }}>
                                    <Skeleton height={14} width={80} mb={6} />
                                    <Skeleton height={36} radius="sm" />
                                </Grid.Col>
                                <Grid.Col span={{ base: 12, sm: 6 }}>
                                    <Skeleton height={14} width={80} mb={6} />
                                    <Skeleton height={36} radius="sm" />
                                </Grid.Col>
                                <Grid.Col span={{ base: 12 }}>
                                    <Skeleton height={14} width={80} mb={6} />
                                    <Skeleton height={80} radius="sm" />
                                </Grid.Col>
                            </Grid>
                        </Card>

                        <Card withBorder radius="lg" className="bg-white p-6">
                            <Skeleton height={20} width={180} mb="md" />
                            <Divider mb="lg" />
                            <Stack gap="md">
                                <Skeleton height={14} width={120} mb={6} />
                                <Skeleton height={36} radius="sm" />
                                <Skeleton height={14} width={120} mb={6} />
                                <Skeleton height={36} radius="sm" />
                            </Stack>
                        </Card>
                    </Stack>
                </Grid.Col>

                {/* Right Side: Limits and Status Skeletons */}
                <Grid.Col span={{ base: 12, md: 4 }}>
                    <Stack gap="lg">
                        <Card withBorder radius="lg" className="bg-white p-6">
                            <Skeleton height={20} width={140} mb="md" />
                            <Divider mb="lg" />
                            <Stack gap="md">
                                <Skeleton height={14} width={60} mb={6} />
                                <Skeleton height={36} radius="sm" />
                                <Skeleton height={14} width={80} mb={6} />
                                <Skeleton height={36} radius="sm" />
                                <Skeleton height={14} width={80} mb={6} />
                                <Skeleton height={36} radius="sm" />
                                <Skeleton height={14} width={80} mb={6} />
                                <Skeleton height={36} radius="sm" />
                            </Stack>
                        </Card>

                        <Card withBorder radius="lg" className="bg-white p-6">
                            <Stack gap="md">
                                <Skeleton height={36} radius="sm" />
                                <Skeleton height={36} radius="sm" />
                            </Stack>
                        </Card>
                    </Stack>
                </Grid.Col>
            </Grid>
        </div>
    );
}
