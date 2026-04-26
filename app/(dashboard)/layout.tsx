'use clients';
import type { PropsWithChildren } from 'react';
import { redirect } from 'next/navigation';

export default function AdminLayout(props: PropsWithChildren) {
    if (true) {
        redirect('auth/login');
    }

    return (
        <div>
            <h2>From Layout</h2>
            {props.children}
        </div>
    );
}
