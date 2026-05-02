'use client';
import { GoSidebarCollapse } from 'react-icons/go';
import classNames from 'classnames';
/**
 * Internal dependency
 */
import { useAppSelector, useAppDispatch } from '@/app/lib/store';
import { selectSidebarExpanded, setSidebarExpanded } from '@/app/lib/store/ui/slice';

export default function CollapseButton() {
    const dispatch = useAppDispatch();
    const sidebarExpanded = useAppSelector(selectSidebarExpanded);

    const toggleSidebar = () => {
        dispatch(setSidebarExpanded(!sidebarExpanded));
    };

    const toggleBtnClasses = classNames([
        'ml-4 w-9 h-9 flex items-center justify-center rounded-full cursor-pointer',
        {
            'rotate-180 bg-primary/10 text-primary': sidebarExpanded,
            'border border-solid border-primary/10 hover:bg-primary/10 hover:text-primary':
                !sidebarExpanded,
        },
    ]);

    return (
        <button onClick={toggleSidebar} className={toggleBtnClasses}>
            <GoSidebarCollapse size={18} />
        </button>
    );
}
