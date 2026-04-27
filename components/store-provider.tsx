'use client';
import { Provider } from 'react-redux';
import { store } from '@/app/lib/store';
import type { PropsWithChildren } from 'react';

export default function StoreProvider(props: PropsWithChildren) {
    const { children } = props;
    return <Provider store={store}>{children}</Provider>;
}
