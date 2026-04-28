import type { PropsWithChildren } from 'react';
import { redirect } from 'next/navigation';
import { getSession } from '@/app/lib/auth';
import { isEmpty } from 'lodash';
import AdminSidebar from '@/components/dashboard/sidebar';

export default async function AdminLayout(props: PropsWithChildren) {
    const session = await getSession();

    if (isEmpty(session)) {
        redirect('auth/login');
    }

    return (
        <AdminSidebar>
            <div className="flex flex-col">
                <div className="h-16 bg-gray-100">YYY</div>
                <div className="grow overflow-y-auto h-[calc(100vh-64px)] p-4">
                    {props.children}
                </div>
            </div>
        </AdminSidebar>
    );
}
