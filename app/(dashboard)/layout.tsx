import type { PropsWithChildren } from 'react';
import { redirect } from 'next/navigation';
import { getSession } from '@/app/lib/auth';
import { isEmpty } from 'lodash';

export default async function AdminLayout(props: PropsWithChildren) {
    const session = await getSession();

    if (isEmpty(session)) {
        redirect('auth/login');
    }

    return (
        <div>
            <h2>From Layout</h2>
            {props.children}
        </div>
    );
}
