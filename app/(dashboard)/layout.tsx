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
                <div className="h-14 bg-white">YYY</div>
                <div className="grow overflow-y-auto bg-gray-100 h-[calc(100vh-56px)] p-4">
                    {props.children}
                </div>
            </div>
        </AdminSidebar>
    );
}
