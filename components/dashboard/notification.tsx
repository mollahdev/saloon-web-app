'use client';
import { IoNotificationsOutline } from 'react-icons/io5';
import { useDisclosure } from '@mantine/hooks';
import { Drawer } from '@mantine/core';

export default function Notification() {
    const [opened, { open, close }] = useDisclosure(false);

    return (
        <div>
            <div
                className="w-8 h-8 flex rounded-full justify-center items-center relative cursor-pointer"
                onClick={open}
            >
                <IoNotificationsOutline size={20} />
                <div className="absolute -0 w-4! h-4! right-0 flex items-center justify-center! bg-red-700 text-white text-xs rounded-full top-0 scale-90">
                    2
                </div>
            </div>
            <Drawer position="right" opened={opened} onClose={close} title="Authentication">
                <h2>Notification Panel</h2>
            </Drawer>
        </div>
    );
}
