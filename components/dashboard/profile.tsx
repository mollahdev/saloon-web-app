'use client';
import { Avatar, Menu, UnstyledButton } from '@mantine/core';
import { CiCircleInfo } from 'react-icons/ci';
import Link from 'next/link';
import { IoExitOutline } from 'react-icons/io5';
import { useState } from 'react';
import { useAppDispatch } from '@/app/lib/store';
import { logoutAction } from '@/app/lib/store/auth/action';
import { CiLock } from 'react-icons/ci';
import { CiStopwatch } from 'react-icons/ci';

export default function Profile() {
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useAppDispatch();

    const handleLogout = () => {
        setIsLoading(true);
        dispatch(logoutAction())
            .unwrap()
            .then(() => {
                setIsLoading(false);
                // reload
                window.location.reload();
            })
            .catch(() => {
                setIsLoading(false);
            });
    };

    return (
        <div className="mr-4 mt-1.5">
            <Menu width={180} shadow="md" position="bottom-end" offset={10}>
                <Menu.Target>
                    <UnstyledButton
                        style={{
                            padding: '0',
                            color: 'var(--mantine-color-text)',
                            borderRadius: 'var(--mantine-radius-sm)',
                        }}
                    >
                        <Avatar
                            className="border border-primary/10"
                            src="https://static.vecteezy.com/system/resources/previews/052/523/015/non_2x/3d-icon-avatar-cartoon-character-smiling-man-learning-people-close-up-portrait-on-isolated-on-transparent-background-png.png"
                            radius="xl"
                        />
                    </UnstyledButton>
                </Menu.Target>
                <Menu.Dropdown className="grid gap-1">
                    <Link href={'/admin/profile'}>
                        <Menu.Item>
                            <div className="flex items-center gap-2 h-6">
                                <CiCircleInfo size={18} />
                                My Profile Info
                            </div>
                        </Menu.Item>
                    </Link>
                    <Link href={'/admin/working-hours'}>
                        <Menu.Item>
                            <div className="flex items-center gap-2 h-6">
                                <CiStopwatch size={18} />
                                Working Hours
                            </div>
                        </Menu.Item>
                    </Link>
                    <Link href={'/admin/settings'}>
                        <Menu.Item>
                            <div className="flex items-center gap-2 h-6">
                                <CiLock size={18} />
                                Change Password
                            </div>
                        </Menu.Item>
                    </Link>
                    <button
                        onClick={handleLogout}
                        disabled={isLoading}
                        className="w-full px-3 py-2 rounded-md bg-red-50 hover:bg-red-100 cursor-pointer transition-colors duration-200"
                    >
                        <div className="flex text-sm font-semibold items-center gap-2 h-6 text-red-700">
                            <IoExitOutline size={18} />
                            {isLoading ? 'Logging out...' : 'Logout'}
                        </div>
                    </button>
                </Menu.Dropdown>
            </Menu>
        </div>
    );
}
