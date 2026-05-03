'use client';
import { Table, Group, Text, Avatar, Badge, ActionIcon, Menu, rem, Tooltip } from '@mantine/core';
import {
    HiOutlineDotsVertical,
    HiOutlinePencil,
    HiOutlineTrash,
    HiOutlineCheck,
    HiOutlineX,
} from 'react-icons/hi';
/**
 * Internal dependencies
 */
import StaffsLoading from './loading';
import { PageTitle } from '@/utils/portal';
import { useGetStaffsQuery } from '@/app/lib/store/staffs/api';
import { STATUS, ROLE } from '@/constants';

const roleColors: Record<string, string> = {
    [ROLE.OWNER]: 'red',
    [ROLE.ADMIN]: 'blue',
    [ROLE.MEMBER]: 'gray',
};

const statusColors: Record<string, string> = {
    [STATUS.ACTIVE]: 'teal',
    [STATUS.INACTIVE]: 'pink',
    [STATUS.PENDING_VERIFICATION]: 'orange',
    [STATUS.LOCKED]: 'red',
};

export default function StaffsPage() {
    const { data: response, isLoading, error } = useGetStaffsQuery();
    const staffs = response?.data || [];

    if (isLoading) {
        return (
            <>
                <PageTitle.Source>Staffs</PageTitle.Source>
                <StaffsLoading />
            </>
        );
    }

    if (error) {
        return (
            <>
                <PageTitle.Source>Staffs</PageTitle.Source>
                <div className="bg-red-50 p-4 rounded-lg text-red-600">
                    Failed to load staffs. Please try again later.
                </div>
            </>
        );
    }

    const rows = staffs.map((staff) => (
        <Table.Tr key={staff.id}>
            <Table.Td>
                <Group gap="sm">
                    <Avatar size={40} src={staff.avatar} radius={40} color="primary" />
                    <div>
                        <Text fz="sm" fw={500}>
                            {staff.name}
                        </Text>
                        <Text fz="xs" c="dimmed">
                            {staff.email}
                        </Text>
                    </div>
                </Group>
            </Table.Td>

            <Table.Td>
                <Text fz="sm">{staff.position || 'N/A'}</Text>
            </Table.Td>

            <Table.Td>
                <Badge color={roleColors[staff.role]} variant="light" size="sm">
                    {staff.role}
                </Badge>
            </Table.Td>

            <Table.Td>
                <Badge color={statusColors[staff.status]} variant="dot" size="sm">
                    {staff.status.replace(/_/g, ' ')}
                </Badge>
            </Table.Td>

            <Table.Td>
                <Group gap={0} justify="flex-end">
                    <Tooltip label="Edit Staff">
                        <ActionIcon variant="subtle" color="gray">
                            <HiOutlinePencil
                                style={{ width: rem(16), height: rem(16) }}
                                strokeWidth={1.5}
                            />
                        </ActionIcon>
                    </Tooltip>
                    <Menu
                        transitionProps={{ transition: 'pop' }}
                        withArrow
                        position="bottom-end"
                        withinPortal
                    >
                        <Menu.Target>
                            <ActionIcon variant="subtle" color="gray">
                                <HiOutlineDotsVertical
                                    style={{ width: rem(16), height: rem(16) }}
                                    strokeWidth={1.5}
                                />
                            </ActionIcon>
                        </Menu.Target>
                        <Menu.Dropdown>
                            <Menu.Item
                                leftSection={
                                    <HiOutlineCheck
                                        style={{ width: rem(14), height: rem(14) }}
                                        strokeWidth={1.5}
                                    />
                                }
                            >
                                Activate
                            </Menu.Item>
                            <Menu.Item
                                leftSection={
                                    <HiOutlineX
                                        style={{ width: rem(14), height: rem(14) }}
                                        strokeWidth={1.5}
                                    />
                                }
                            >
                                Deactivate
                            </Menu.Item>
                            <Menu.Divider />
                            <Menu.Item
                                color="red"
                                leftSection={
                                    <HiOutlineTrash
                                        style={{ width: rem(14), height: rem(14) }}
                                        strokeWidth={1.5}
                                    />
                                }
                            >
                                Delete staff
                            </Menu.Item>
                        </Menu.Dropdown>
                    </Menu>
                </Group>
            </Table.Td>
        </Table.Tr>
    ));

    return (
        <>
            <PageTitle.Source>Staffs</PageTitle.Source>
            <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm border border-gray-100">
                <Table verticalSpacing="sm">
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Th>Staff Member</Table.Th>
                            <Table.Th>Position</Table.Th>
                            <Table.Th>Role</Table.Th>
                            <Table.Th>Status</Table.Th>
                            <Table.Th aria-label="Actions" />
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>{rows}</Table.Tbody>
                </Table>

                {staffs.length === 0 && (
                    <div className="text-center py-12">
                        <Text c="dimmed">No staff members found.</Text>
                    </div>
                )}
            </div>
        </>
    );
}
