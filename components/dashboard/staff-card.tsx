'use client';
import {
    Card,
    Stack,
    Group,
    Avatar,
    Text,
    Badge,
    Divider,
    Tooltip,
    ActionIcon,
    Button,
} from '@mantine/core';
import { HiOutlineTrash } from 'react-icons/hi';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Profile } from '@/models/profile';
import { ROLE, STATUS } from '@/constants';
import { useConfirmation } from '@/hooks/use-confirmation';
import { useDeleteStaffMutation } from '@/app/lib/store/staffs/api';
import toast from 'react-hot-toast';

interface StaffCardProps {
    staff: Profile;
    onEdit: (staff: Profile) => void;
}

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

export function StaffCard({ staff, onEdit }: StaffCardProps) {
    const { confirm } = useConfirmation();
    const [deleteStaff] = useDeleteStaffMutation();
    const router = useRouter();

    const handleEditClick = () => {
        if (staff.status === STATUS.PENDING_VERIFICATION) {
            onEdit(staff);
        } else {
            router.push(`/admin/staffs/${staff.id}`);
        }
    };

    const handleDeleteClick = () => {
        confirm({
            title: 'Delete Staff',
            message: `Are you sure you want to delete ${staff.name}? This action cannot be undone.`,
            confirmLabel: 'Delete',
            color: 'red',
            onConfirm: async () => {
                try {
                    await deleteStaff(staff.id).unwrap();
                    toast.success('Staff member deleted successfully');
                } catch (error: any) {
                    toast.error(error?.data?.message || 'Failed to delete staff member');
                    throw error; // Rethrow to keep modal state if needed, though provider closes on success
                }
            },
        });
    };

    return (
        <Card
            padding="xl"
            radius="md"
            className="relative transition-all duration-200 border border-gray-100 overflow-hidden hover:-translate-y-1 hover:shadow-lg bg-white group"
        >
            {/* Top Gradient Border */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-cyan-400" />

            <Stack align="center" gap="sm" className="relative z-10">
                <div className="relative mt-2">
                    <Avatar
                        src={staff.avatar}
                        size={80}
                        radius={80}
                        color="primary"
                        className="border-2 border-gray-50"
                    />
                    <div
                        className={`absolute bottom-0.5 right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white ${
                            staff.status === STATUS.ACTIVE ? 'bg-teal-500' : 'bg-gray-400'
                        }`}
                    />
                </div>

                <div className="text-center">
                    <Text className="text-lg font-bold text-gray-800 tracking-tight">
                        {staff.name}
                    </Text>
                    <Text className="text-sm font-medium text-gray-500">
                        {staff.position || 'Specialist'}
                    </Text>
                </div>

                <Group justify="center" gap="xs" mt="xs">
                    <Badge
                        color={roleColors[staff.role]}
                        variant="light"
                        size="sm"
                        className="font-semibold"
                    >
                        {staff.role}
                    </Badge>
                    <Badge color={statusColors[staff.status]} variant="dot" size="sm">
                        {staff.status === STATUS.PENDING_VERIFICATION
                            ? 'PENDING'
                            : staff.status.replace(/_/g, ' ')}
                    </Badge>
                </Group>
            </Stack>

            <Divider my="md" variant="dashed" className="opacity-60" />

            <div className="flex flex-row items-center gap-1.5 w-full">
                <Button
                    variant="light"
                    color="blue"
                    size="sm"
                    px={12}
                    className="flex-initial h-9 transition-all hover:bg-blue-100 font-bold text-[13px]"
                    onClick={handleEditClick}
                >
                    Edit
                </Button>

                {staff.status === STATUS.PENDING_VERIFICATION ? (
                    <Button
                        disabled
                        variant="light"
                        color="teal"
                        size="sm"
                        px={6}
                        className="flex-1 h-9 font-bold text-[13px]"
                    >
                        Schedule
                    </Button>
                ) : (
                    <Link href={`/admin/schedule/${staff.id}`} className="flex-1">
                        <Button
                            variant="light"
                            color="teal"
                            size="sm"
                            px={6}
                            fullWidth
                            className="h-9 transition-all hover:bg-teal-100 font-bold text-[13px]"
                        >
                            Schedule
                        </Button>
                    </Link>
                )}

                <Tooltip label="Delete Staff" withArrow>
                    <ActionIcon
                        variant="light"
                        color="red"
                        size="lg"
                        className="h-9 w-9 transition-colors duration-200 hover:bg-red-100 shrink-0"
                        onClick={handleDeleteClick}
                    >
                        <HiOutlineTrash size={18} strokeWidth={1.5} />
                    </ActionIcon>
                </Tooltip>
            </div>
        </Card>
    );
}
