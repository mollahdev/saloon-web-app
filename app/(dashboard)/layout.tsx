import type { PropsWithChildren } from 'react';
import { isEmpty } from 'lodash';
import { redirect } from 'next/navigation';
/**
 * Internal dependency
 */
import { getSession } from '@/app/lib/auth';
import AdminSidebar from '@/components/dashboard/sidebar';
import CollapseButton from '@/components/dashboard/collapse-btn';
import Profile from '@/components/dashboard/profile';
import Notification from '@/components/dashboard/notification';

export default async function AdminLayout(props: PropsWithChildren) {
    const session = await getSession();

    if (isEmpty(session)) {
        redirect('/auth/login');
    }

    return (
        <AdminSidebar>
            <div className="flex flex-col">
                <div className="h-14 bg-white flex justify-between items-center">
                    <CollapseButton />
                    <div className="flex items-center gap-5">
                        <Notification />
                        <Profile />
                    </div>
                </div>
                <div className="grow overflow-y-auto bg-gray-100 h-[calc(100vh-56px)] p-4">
                    {props.children}
                </div>
            </div>
        </AdminSidebar>
    );
}
