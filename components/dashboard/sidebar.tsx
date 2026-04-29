'use client';
import type { PropsWithChildren } from 'react';
import classNames from 'classnames';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
/**
 * Internal dependency
 */
import { useAppSelector, useAppDispatch } from '@/app/lib/store';
import {
    selectSidebarExpanded,
    setSidebarExpanded,
    selectDevice,
} from '@/app/lib/store/ui-slice/ui-slice';
import SidebarLogo from './sidebar-logo';
import SidebarMenu from './sidebar-menu';

export default function AdminSidebar(props: PropsWithChildren) {
    const dispatch = useAppDispatch();
    const sidebarExpanded = useAppSelector(selectSidebarExpanded);
    const device = useAppSelector(selectDevice);
    const pathname = usePathname();

    // Auto-close sidebar on mobile when navigating to a new page
    useEffect(() => {
        if (device === 'mobile') {
            dispatch(setSidebarExpanded(false));
        }
    }, [pathname, device, dispatch]);

    const wrapperClasses = classNames(['flex h-screen w-full relative overflow-hidden']);

    const sidebarClasses = classNames([
        'bg-dark800 h-full shrink-0 transition-all duration-300 z-50',
        'absolute md:relative',
        {
            'w-[70px]': !sidebarExpanded,
            'w-[220px]': sidebarExpanded,
        },
    ]);

    return (
        <div className={wrapperClasses}>
            {/* Mobile Backdrop Overlay - allows closing sidebar when floating over content */}
            {sidebarExpanded && (
                <div
                    className="fixed inset-0 bg-black/20 z-40 md:hidden backdrop-blur-[2px]"
                    onClick={() => dispatch(setSidebarExpanded(false))}
                    aria-label="Close sidebar"
                />
            )}

            <div className={sidebarClasses}>
                <SidebarLogo />
                <SidebarMenu />
            </div>

            <div className="flex-1 min-w-0 h-full ml-[70px] md:ml-0 transition-none flex flex-col">
                {props.children}
            </div>
        </div>
    );
}
