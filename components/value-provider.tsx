'use client';
import type { PropsWithChildren } from 'react';
import { useEffect } from 'react';
import { useAppDispatch } from '@/app/lib/store';
import { setAccessToken } from '@/app/lib/store/auth-slice/auth-slice';

type Props = {
    accessToken: string;
};

export default function ValueProvider(props: PropsWithChildren<Props>) {
    const { accessToken, children } = props;
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (accessToken) {
            dispatch(setAccessToken(accessToken));
        }
    }, [accessToken, dispatch]);

    return <div>{children}</div>;
}
