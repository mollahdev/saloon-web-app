'use client';

import { Group, Button } from '@mantine/core';
import { HiOutlineClock, HiOutlineCalendar } from 'react-icons/hi';
import { PageTitle } from '@/utils/portal';

interface Tab {
    id: string;
    label: string;
    icon?: React.ReactNode;
}

interface SchedulePageHeaderProps {
    title: string;
    description: string;
    activeTab: string;
    onTabChange: (tabId: any) => void;
    tabs: Tab[];
}

export function SchedulePageHeader({
    title,
    description,
    activeTab,
    onTabChange,
    tabs,
}: SchedulePageHeaderProps) {
    return (
        <>
            <PageTitle.Source>{title}</PageTitle.Source>

            <div className="flex flex-col gap-1 mb-6">
                <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">{title}</h1>
                <p className="text-gray-500 text-sm">{description}</p>
            </div>

            {/* Tab buttons */}
            <Group gap="sm" className="mb-6">
                {tabs.map((tab) => (
                    <Button
                        key={tab.id}
                        variant={activeTab === tab.id ? 'filled' : 'default'}
                        leftSection={
                            tab.icon ||
                            (tab.id === 'schedule' ? (
                                <HiOutlineClock size={18} />
                            ) : (
                                <HiOutlineCalendar size={18} />
                            ))
                        }
                        onClick={() => onTabChange(tab.id)}
                        size="sm"
                        radius="md"
                    >
                        {tab.label}
                    </Button>
                ))}
            </Group>
        </>
    );
}
