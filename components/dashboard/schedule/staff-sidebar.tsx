'use client';

import { Text, Avatar, ScrollArea, Skeleton } from '@mantine/core';
import Link from 'next/link';
import classNames from 'classnames';
import { HiOutlineOfficeBuilding } from 'react-icons/hi';

interface Staff {
    id: string;
    name: string;
    avatar?: string | null;
    position?: string | null;
}

interface StaffSidebarProps {
    staffs: Staff[];
    isLoading: boolean;
    pathname: string;
}

export function StaffSidebar({ staffs, isLoading, pathname }: StaffSidebarProps) {
    return (
        <aside className="w-full md:w-80 shrink-0">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col md:h-[calc(100vh-120px)] md:sticky md:top-4 overflow-hidden">
                {/* Desktop Header */}
                <div className="p-6 border-b border-gray-50 hidden md:block">
                    <Text fw={900} size="xl" className="tracking-tighter text-gray-900">
                        Schedules
                    </Text>
                </div>

                <ScrollArea className="flex-1 md:p-4 p-1.5 md:p-2" scrollbars="y">
                    <div className="flex md:flex-col gap-1.5 md:gap-3 overflow-x-auto md:overflow-x-visible no-scrollbar pb-1 md:pb-0 items-center md:items-stretch">
                        {/* Business Schedule Link */}
                        <Link href="/admin/schedule" className="shrink-0">
                            <SidebarItem
                                href="/admin/schedule"
                                isActive={pathname === '/admin/schedule'}
                                label="Business"
                                subLabel="General"
                                icon={<HiOutlineOfficeBuilding size={16} className="md:hidden" />}
                                desktopIcon={
                                    <HiOutlineOfficeBuilding
                                        size={24}
                                        className="hidden md:block"
                                    />
                                }
                            />
                        </Link>

                        {/* Separator for desktop */}
                        <div className="mt-6 mb-3 px-4 hidden md:block">
                            <Text
                                size="xs"
                                fw={900}
                                className="uppercase text-gray-400 tracking-[0.2em]"
                            >
                                Staff Members
                            </Text>
                        </div>

                        {/* Visual separator for mobile */}
                        <div className="w-[1px] h-6 bg-gray-200 mx-1 md:hidden self-center shrink-0" />

                        {isLoading ? (
                            <SidebarSkeleton />
                        ) : staffs.length === 0 ? (
                            <div className="px-4 py-6 text-center hidden md:block">
                                <Text size="xs" c="dimmed italic">
                                    No staff found
                                </Text>
                            </div>
                        ) : (
                            staffs.map((staff) => (
                                <Link
                                    key={staff.id}
                                    href={`/admin/schedule/${staff.id}`}
                                    className="shrink-0"
                                >
                                    <SidebarItem
                                        href={`/admin/schedule/${staff.id}`}
                                        isActive={pathname === `/admin/schedule/${staff.id}`}
                                        label={staff.name}
                                        subLabel={staff.position || 'Specialist'}
                                        avatar={staff.avatar}
                                    />
                                </Link>
                            ))
                        )}
                    </div>
                </ScrollArea>
            </div>
        </aside>
    );
}

interface SidebarItemProps {
    href: string;
    isActive: boolean;
    label: string;
    subLabel: string;
    icon?: React.ReactNode;
    desktopIcon?: React.ReactNode;
    avatar?: string | null;
}

function SidebarItem({ isActive, label, subLabel, icon, desktopIcon, avatar }: SidebarItemProps) {
    return (
        <div
            className={classNames(
                'flex items-center gap-2 md:gap-4 px-3 py-1.5 md:px-4 md:py-3 rounded-xl transition-all duration-200 group whitespace-nowrap',
                {
                    'bg-primary/10 text-primary shadow-sm ring-1 ring-primary/20': isActive,
                    'text-gray-500 hover:bg-gray-50 hover:text-gray-900': !isActive,
                }
            )}
        >
            <div className="relative">
                {avatar ? (
                    <Avatar
                        src={avatar}
                        size={28}
                        radius={28}
                        className={classNames(
                            'transition-all duration-300 md:w-11 md:h-11 md:min-w-[44px]',
                            {
                                'ring-2 ring-primary ring-offset-2 scale-110 shadow-lg shadow-primary/20':
                                    isActive,
                                'grayscale-[0.5] group-hover:grayscale-0': !isActive,
                            }
                        )}
                    />
                ) : (
                    <div
                        className={classNames(
                            'w-7 h-7 md:w-11 md:h-11 rounded-full flex items-center justify-center transition-all duration-300',
                            {
                                'bg-primary text-white scale-110 shadow-lg shadow-primary/30':
                                    isActive,
                                'bg-gray-100 text-gray-400 group-hover:bg-gray-200 group-hover:text-gray-600':
                                    !isActive,
                            }
                        )}
                    >
                        {icon}
                        {desktopIcon}
                    </div>
                )}
                {isActive && avatar && (
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-primary rounded-full border-2 border-white md:flex items-center justify-center hidden">
                        <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                    </div>
                )}
            </div>
            <div className="flex flex-col min-w-0">
                <span className="text-[13px] md:text-base font-bold truncate">{label}</span>
                <span className="text-[10px] uppercase font-black opacity-40 truncate hidden md:block tracking-widest">
                    {subLabel}
                </span>
            </div>
        </div>
    );
}

function SidebarSkeleton() {
    return (
        <>
            {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3 px-4 py-2 shrink-0">
                    <Skeleton height={32} width={32} circle className="md:h-12 md:w-12" />
                    <div className="hidden md:flex flex-col flex-1">
                        <Skeleton height={16} width="80%" mb={8} />
                        <Skeleton height={12} width="40%" />
                    </div>
                </div>
            ))}
        </>
    );
}
