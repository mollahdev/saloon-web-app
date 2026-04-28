'use client';
import type { PropsWithChildren } from 'react';
import classNames from 'classnames';
/**
 * Internal dependency
 */
import { useAppSelector, useAppDispatch } from '@/app/lib/store';
import { selectSidebarExpanded, setSidebarExpanded } from '@/app/lib/store/ui-slice/ui-slice';

export default function AdminSidebar(props: PropsWithChildren) {
    const dispatch = useAppDispatch();
    const sidebarExpanded = useAppSelector(selectSidebarExpanded);

    const toggleSidebar = () => {
        dispatch(setSidebarExpanded(!sidebarExpanded));
    };

    const wrapperClasses = classNames([
        'grid h-screen transition-all duration-300',
        {
            'grid-cols-[75px_1fr]': !sidebarExpanded,
            'grid-cols-[220px_1fr]': sidebarExpanded,
        },
    ]);

    return (
        <div className={wrapperClasses}>
            <div className="bg-dark800">
                XXX
                <button className="cursor-pointer" onClick={toggleSidebar}>
                    Toggle
                </button>
            </div>
            {props.children}
        </div>
    );
}
