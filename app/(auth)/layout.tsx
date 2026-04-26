import type { PropsWithChildren } from 'react';

export default function AuthLayout(props: PropsWithChildren) {
    return <div className="bg-gray-100">{props.children}</div>;
}
