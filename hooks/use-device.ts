import { useEffect } from 'react';
import { useAppDispatch } from '@/app/lib/store';
import { detectDevice } from '@/utils/device';
import { setDevice, setSidebarExpanded } from '@/app/lib/store/ui/slice';

export const useDevice = () => {
    const dispatch = useAppDispatch();

    useEffect(() => {
        const handleResize = () => {
            const device = detectDevice();
            dispatch(setDevice(device));
            dispatch(setSidebarExpanded(device === 'mobile' ? false : true));
        };

        handleResize();

        // Mutually exclusive breakpoints matching detectDevice logic
        const mobileMediaQuery = window.matchMedia('(max-width: 767px)');
        const tabletMediaQuery = window.matchMedia('(min-width: 768px) and (max-width: 1023px)');
        const desktopMediaQuery = window.matchMedia('(min-width: 1024px)');

        mobileMediaQuery.addEventListener('change', handleResize);
        tabletMediaQuery.addEventListener('change', handleResize);
        desktopMediaQuery.addEventListener('change', handleResize);

        return () => {
            mobileMediaQuery.removeEventListener('change', handleResize);
            tabletMediaQuery.removeEventListener('change', handleResize);
            desktopMediaQuery.removeEventListener('change', handleResize);
        };
    }, [dispatch]);
};
