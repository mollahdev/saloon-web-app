'use client';
import { Skeleton, Divider, Stack, Card, Grid } from '@mantine/core';

const ScheduleSkeleton = () => (
    <Card withBorder radius="md" p="md" className="bg-white">
        <Skeleton height={24} width={180} mb="md" />
        <Stack gap={0}>
            {[...Array(7)].map((_, i) => (
                <div key={i}>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between py-3 gap-2">
                        <Skeleton height={20} width={100} />
                        <Skeleton height={20} width={140} />
                    </div>
                    {i < 6 && <Divider variant="dashed" color="gray.2" />}
                </div>
            ))}
        </Stack>
    </Card>
);

const TimeOffSkeleton = () => (
    <Card withBorder radius="md" p="md" className="bg-white mt-6">
        <Skeleton height={24} width={200} mb="md" />
        <Stack gap="sm">
            {[...Array(2)].map((_, i) => (
                <div
                    key={i}
                    className="p-3 bg-gray-50 rounded-md border border-gray-100 flex flex-col sm:flex-row justify-between sm:items-center gap-2"
                >
                    <div>
                        <Skeleton height={16} width={120} mb={6} />
                        <Skeleton height={14} width={80} />
                    </div>
                    <div className="flex flex-col items-start sm:items-end gap-1.5">
                        <Skeleton height={16} width={140} />
                        <Skeleton height={14} width={100} />
                    </div>
                </div>
            ))}
        </Stack>
    </Card>
);

export default function WorkingHoursLoading() {
    return (
        <div className="max-w-6xl mx-auto w-full pb-10 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <Grid gap="xl">
                <Grid.Col span={{ base: 12, md: 6 }}>
                    <ScheduleSkeleton />
                    <TimeOffSkeleton />
                </Grid.Col>

                <Grid.Col span={{ base: 12, md: 6 }}>
                    <ScheduleSkeleton />
                    <TimeOffSkeleton />
                </Grid.Col>
            </Grid>
        </div>
    );
}
