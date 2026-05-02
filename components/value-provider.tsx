'use client';
import type { PropsWithChildren } from 'react';
import { useEffect } from 'react';
import { useAppDispatch } from '@/app/lib/store';
import { setAccessToken } from '@/app/lib/store/auth/slice';
import { useDevice } from '@/hooks/use-device';

type Props = {
    accessToken: string;
};

export default function ValueProvider(props: PropsWithChildren<Props>) {
    const { accessToken, children } = props;
    const dispatch = useAppDispatch();
    useDevice();

    useEffect(() => {
        if (accessToken) {
            dispatch(setAccessToken(accessToken));
        }
    }, [accessToken, dispatch]);

    return <div>{children}</div>;
}
