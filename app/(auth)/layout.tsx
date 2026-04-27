import type { PropsWithChildren } from 'react';
import { redirect } from 'next/navigation';
import { getSession } from '@/app/lib/auth';

export default async function AuthLayout(props: PropsWithChildren) {
    const session = await getSession();
    if (session) {
        redirect('/admin');
    }
    return <div className="bg-gray-100">{props.children}</div>;
}
