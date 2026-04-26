'use client';
import type { PropsWithChildren } from 'react';
import { useEffect } from 'react';
import { useAppDispatch } from '@/app/lib/store';
import { generateDefaultUserAction } from '@/app/lib/store/auth-slice/auth-action';

export default function AuthLayout(props: PropsWithChildren) {
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(generateDefaultUserAction());
    });

    return <div className="bg-gray-100">{props.children}</div>;
}
