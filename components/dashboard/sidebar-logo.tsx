'use client';
import classNames from 'classnames';
import Image from 'next/image';
/**
 * Internal dependency
 */
import { useAppSelector } from '@/app/lib/store';
import { selectSidebarExpanded } from '@/app/lib/store/ui/slice';
import { projectData } from '@/constants';

export default function SidebarLogo() {
    const sidebarExpanded = useAppSelector(selectSidebarExpanded);

    const headerClasses = classNames([
        'h-14 flex items-center justify-center flex-col',
        {
            'bg-gray-200': sidebarExpanded,
            'bg-white border-r border-gray-200': !sidebarExpanded,
        },
    ]);

    return (
        <div className={headerClasses}>
            {sidebarExpanded ? (
                <span className="text-dark800 font-semibold text-base text-nowrap">
                    {projectData.title}
                </span>
            ) : (
                <Image src={projectData.icon} alt={projectData.title} className="w-12 h-12" />
            )}
        </div>
    );
}
