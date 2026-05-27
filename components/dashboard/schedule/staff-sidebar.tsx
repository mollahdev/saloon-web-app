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
        <aside className="w-full xl:w-80 shrink-0">
            <div className="bg-white rounded-lg xl:rounded-2xl shadow-sm border border-gray-100 flex flex-col xl:h-[calc(100vh-120px)] xl:sticky pt-0.5 xl:top-4 overflow-hidden">
                {/* Desktop Header */}
                <div className="p-6 border-b border-gray-50 hidden xl:block">
                    <Text fw={900} size="xl" className="tracking-tighter text-gray-900">
                        Schedules
                    </Text>
                </div>

                <ScrollArea className="flex-1 xl:p-4 p-1.5 xl:p-2" scrollbars="y">
                    <div className="flex xl:flex-col gap-1.5 xl:gap-3 overflow-x-auto xl:overflow-x-visible no-scrollbar pb-1 xl:pb-0 items-center xl:items-stretch">
                        {/* Business Schedule Link */}
                        <Link href="/admin/schedule" className="shrink-0">
                            <SidebarItem
                                href="/admin/schedule"
                                isActive={pathname === '/admin/schedule'}
                                label="Business"
                                subLabel="General"
                                icon={<HiOutlineOfficeBuilding size={16} className="xl:hidden" />}
                                desktopIcon={
                                    <HiOutlineOfficeBuilding
                                        size={24}
                                        className="hidden xl:block"
                                    />
                                }
                            />
                        </Link>

                        {/* Separator for desktop */}
                        <div className="mt-6 mb-3 px-4 hidden xl:block">
                            <Text
                                size="xs"
                                fw={900}
                                className="uppercase text-gray-400 tracking-[0.2em]"
                            >
                                Staff Members
                            </Text>
                        </div>

                        {/* Visual separator for mobile */}
                        <div className="w-[1px] h-6 bg-gray-200 mx-1 xl:hidden self-center shrink-0" />

                        {isLoading ? (
                            <SidebarSkeleton />
                        ) : staffs.length === 0 ? (
                            <div className="px-4 py-6 text-center hidden xl:block">
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
    const isStaff = !icon && !desktopIcon;

    return (
        <div
            className={classNames(
                'flex items-center gap-2 xl:gap-4 px-3 py-1.5 xl:px-4 xl:py-3 rounded-md xl:rounded-xl transition-all duration-200 group whitespace-nowrap',
                {
                    'bg-primary/10 text-primary': isActive,
                    'text-gray-500 hover:bg-gray-50 hover:text-gray-900': !isActive,
                }
            )}
        >
            <div className="relative">
                {isStaff ? (
                    <Avatar
                        src={avatar || undefined}
                        size={28}
                        radius={28}
                        className={classNames(
                            'transition-all duration-300 xl:w-11 xl:h-11 xl:min-w-[44px]',
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
                            'w-7 h-7 xl:w-11 xl:h-11 rounded-full flex items-center justify-center transition-all duration-300',
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
                {isActive && isStaff && (
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-primary rounded-full border-2 border-white xl:flex items-center justify-center hidden">
                        <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                    </div>
                )}
            </div>
            <div className="flex flex-col min-w-0">
                <span className="text-[13px] xl:text-base font-bold truncate">{label}</span>
                <span className="text-[10px] uppercase font-black opacity-40 truncate hidden xl:block tracking-widest">
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
                    <Skeleton height={32} width={32} circle className="xl:h-12 xl:w-12" />
                    <div className="hidden xl:flex flex-col flex-1">
                        <Skeleton height={16} width="80%" mb={8} />
                        <Skeleton height={12} width="40%" />
                    </div>
                </div>
            ))}
        </>
    );
}
