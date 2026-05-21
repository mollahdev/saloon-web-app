'use client';
import { PageTitle } from '@/utils/portal';
import { useGetScheduleQuery, useGetBusinessTimeOffQuery } from '@/app/lib/store/schedule/api';
import { useGetStaffScheduleQuery, useGetStaffTimeOffQuery } from '@/app/lib/store/staffs/api';
import { useGetProfileQuery } from '@/app/lib/store/profile/api';
import { Badge, Text, Divider, Stack, Card, Grid, Group } from '@mantine/core';
import WorkingHoursLoading from './loading';
import dayjs from 'dayjs';

const formatDayName = (day: string) => {
    return day.charAt(0) + day.slice(1).toLowerCase();
};

const formatTime = (timeStr: string) => {
    if (!timeStr) return '';
    const [hours, minutes] = timeStr.split(':');
    const date = new Date();
    date.setHours(parseInt(hours, 10));
    date.setMinutes(parseInt(minutes, 10));
    return dayjs(date).format('h:mm A');
};

const ScheduleList = ({ schedule, title }: { schedule: any[]; title: string }) => (
    <Card withBorder radius="md" p="md" className="bg-white">
        <Text fw={700} size="lg" mb="md">
            {title}
        </Text>
        <Stack gap={0}>
            {schedule.map((item: any, index: number) => (
                <div key={item.dayOfWeek}>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between py-3 gap-2">
                        <Text fw={600} size="md" className="w-full sm:w-32">
                            {formatDayName(item.dayOfWeek)}
                        </Text>

                        {item.isOffDay ? (
                            <Badge color="red" variant="light">
                                Closed
                            </Badge>
                        ) : (
                            <Group gap="xs">
                                <Badge color="teal" variant="light">
                                    Open
                                </Badge>
                                <Text size="sm" fw={500} c="dimmed">
                                    {formatTime(item.startTime)} - {formatTime(item.endTime)}
                                </Text>
                            </Group>
                        )}
                    </div>
                    {index < schedule.length - 1 && <Divider variant="dashed" color="gray.2" />}
                </div>
            ))}
        </Stack>
    </Card>
);

export default function WorkingHoursPage() {
    const { data: profileRes, isLoading: isLoadingProfile } = useGetProfileQuery();
    const profile = profileRes?.data;

    const { data: businessScheduleRes, isLoading: isLoadingBusiness } = useGetScheduleQuery();

    const { data: staffScheduleRes, isLoading: isLoadingStaffSchedule } = useGetStaffScheduleQuery(
        profile?.id as string,
        { skip: !profile?.id }
    );

    const { data: staffTimeOffRes, isLoading: isLoadingTimeOff } = useGetStaffTimeOffQuery(
        profile?.id as string,
        { skip: !profile?.id }
    );

    const { data: businessTimeOffRes, isLoading: isLoadingBusinessTimeOff } =
        useGetBusinessTimeOffQuery();

    if (
        isLoadingProfile ||
        isLoadingBusiness ||
        isLoadingStaffSchedule ||
        isLoadingTimeOff ||
        isLoadingBusinessTimeOff
    ) {
        return (
            <>
                <PageTitle.Source>Working Hours</PageTitle.Source>
                <WorkingHoursLoading />
            </>
        );
    }

    const businessSchedule = businessScheduleRes?.data?.schedule || [];
    const staffSchedule = staffScheduleRes?.data?.workingHours || [];
    const staffTimeOff = staffTimeOffRes?.data || [];
    const businessTimeOff = businessTimeOffRes?.data || [];

    return (
        <>
            <PageTitle.Source>Working Hours</PageTitle.Source>
            <div className="max-w-6xl mx-auto w-full pb-10 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <Grid gap="xl">
                    <Grid.Col span={{ base: 12, md: 6 }}>
                        <ScheduleList schedule={staffSchedule} title="My Working Hours" />

                        {staffTimeOff.length > 0 && (
                            <Card withBorder radius="md" p="md" className="bg-white mt-6">
                                <Text fw={700} size="lg" mb="md">
                                    My Upcoming Time Off
                                </Text>
                                <Stack gap="sm">
                                    {staffTimeOff.map((timeOff: any) => (
                                        <div
                                            key={timeOff.id}
                                            className="p-3 bg-gray-50 rounded-md border border-gray-100 flex flex-col sm:flex-row justify-between sm:items-center gap-2"
                                        >
                                            <div>
                                                <Text fw={600} size="sm">
                                                    {timeOff.title}
                                                </Text>
                                                <Text size="xs" c="dimmed">
                                                    {timeOff.type}
                                                </Text>
                                            </div>
                                            <div className="text-left sm:text-right">
                                                <Text size="sm" fw={500}>
                                                    {dayjs(timeOff.startDate).format('MMM D, YYYY')}
                                                    {timeOff.endDate &&
                                                        timeOff.endDate !== timeOff.startDate &&
                                                        ` - ${dayjs(timeOff.endDate).format('MMM D, YYYY')}`}
                                                </Text>
                                                {!timeOff.isFullDay &&
                                                    timeOff.startTime &&
                                                    timeOff.endTime && (
                                                        <Text size="xs" c="dimmed">
                                                            {formatTime(timeOff.startTime)} -{' '}
                                                            {formatTime(timeOff.endTime)}
                                                        </Text>
                                                    )}
                                            </div>
                                        </div>
                                    ))}
                                </Stack>
                            </Card>
                        )}
                    </Grid.Col>

                    <Grid.Col span={{ base: 12, md: 6 }}>
                        <ScheduleList schedule={businessSchedule} title="Business Hours" />

                        {businessTimeOff.length > 0 && (
                            <Card withBorder radius="md" p="md" className="bg-white mt-6">
                                <Text fw={700} size="lg" mb="md">
                                    Business Time Off
                                </Text>
                                <Stack gap="sm">
                                    {businessTimeOff.map((timeOff: any) => (
                                        <div
                                            key={timeOff.id}
                                            className="p-3 bg-gray-50 rounded-md border border-gray-100 flex flex-col sm:flex-row justify-between sm:items-center gap-2"
                                        >
                                            <div>
                                                <Text fw={600} size="sm">
                                                    {timeOff.title}
                                                </Text>
                                                <Text size="xs" c="dimmed">
                                                    {timeOff.type}
                                                </Text>
                                            </div>
                                            <div className="text-left sm:text-right">
                                                <Text size="sm" fw={500}>
                                                    {dayjs(timeOff.startDate).format('MMM D, YYYY')}
                                                    {timeOff.endDate &&
                                                        timeOff.endDate !== timeOff.startDate &&
                                                        ` - ${dayjs(timeOff.endDate).format('MMM D, YYYY')}`}
                                                </Text>
                                                {!timeOff.isFullDay &&
                                                    timeOff.startTime &&
                                                    timeOff.endTime && (
                                                        <Text size="xs" c="dimmed">
                                                            {formatTime(timeOff.startTime)} -{' '}
                                                            {formatTime(timeOff.endTime)}
                                                        </Text>
                                                    )}
                                            </div>
                                        </div>
                                    ))}
                                </Stack>
                            </Card>
                        )}
                    </Grid.Col>
                </Grid>
            </div>
        </>
    );
}
