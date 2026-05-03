'use client';
import { Skeleton, Table, Group } from '@mantine/core';

export default function StaffsLoading() {
    return (
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm border border-gray-100">
            <Table verticalSpacing="md">
                <Table.Thead>
                    <Table.Tr>
                        <Table.Th>
                            <Skeleton height={20} width={100} />
                        </Table.Th>
                        <Table.Th>
                            <Skeleton height={20} width={80} />
                        </Table.Th>
                        <Table.Th>
                            <Skeleton height={20} width={150} />
                        </Table.Th>
                        <Table.Th>
                            <Skeleton height={20} width={80} />
                        </Table.Th>
                        <Table.Th aria-label="Actions" />
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                    {[...Array(5)].map((_, i) => (
                        <Table.Tr key={i}>
                            <Table.Td>
                                <Group gap="sm">
                                    <Skeleton height={38} circle />
                                    <div style={{ flex: 1 }}>
                                        <Skeleton height={14} width="70%" mb={4} />
                                        <Skeleton height={12} width="40%" />
                                    </div>
                                </Group>
                            </Table.Td>
                            <Table.Td>
                                <Skeleton height={14} width="60%" />
                            </Table.Td>
                            <Table.Td>
                                <Skeleton height={24} width={60} radius="xl" />
                            </Table.Td>
                            <Table.Td>
                                <Skeleton height={24} width={80} radius="xl" />
                            </Table.Td>
                            <Table.Td>
                                <Skeleton height={30} width={30} radius="sm" />
                            </Table.Td>
                        </Table.Tr>
                    ))}
                </Table.Tbody>
            </Table>
        </div>
    );
}
