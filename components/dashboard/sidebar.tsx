'use client';
import type { PropsWithChildren } from 'react';
import classNames from 'classnames';
import Image from 'next/image';

/**
 * Internal dependency
 */
import { useAppSelector } from '@/app/lib/store';
import { selectSidebarExpanded } from '@/app/lib/store/ui-slice/ui-slice';
import { projectData } from '@/constants';

export default function AdminSidebar(props: PropsWithChildren) {
    const sidebarExpanded = useAppSelector(selectSidebarExpanded);

    const wrapperClasses = classNames([
        'grid h-screen transition-all duration-300',
        {
            'grid-cols-[75px_1fr]': !sidebarExpanded,
            'grid-cols-[220px_1fr]': sidebarExpanded,
        },
    ]);

    const headerClasses = classNames([
        'h-14 flex items-center justify-center flex-col',
        {
            'bg-linear-to-r from-primary/50 to-primary': sidebarExpanded,
            'bg-white border-r border-gray-200': !sidebarExpanded,
        },
    ]);

    return (
        <div className={wrapperClasses}>
            <div className="bg-dark800">
                <div className={headerClasses}>
                    {sidebarExpanded ? (
                        <span className="text-white font-semibold text-base text-nowrap">
                            {projectData.title}
                        </span>
                    ) : (
                        <Image
                            src={projectData.icon}
                            alt={projectData.title}
                            className="w-12 h-12"
                        />
                    )}
                </div>
            </div>
            {props.children}
        </div>
    );
}
