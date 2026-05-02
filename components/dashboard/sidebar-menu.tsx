'use client';
import classNames from 'classnames';
import { CiCalendar } from 'react-icons/ci';
import { LuScissors } from 'react-icons/lu';
import { RiCoupon2Line } from 'react-icons/ri';
import { RxPeople } from 'react-icons/rx';
import { GoDatabase } from 'react-icons/go';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
/**
 * Internal dependency
 */
import { useAppSelector } from '@/app/lib/store';
import { selectSidebarExpanded } from '@/app/lib/store/ui/slice';

export default function SidebarMenu() {
    const sidebarExpanded = useAppSelector(selectSidebarExpanded);
    const pathname = usePathname();

    const menus = [
        {
            name: 'Appointments',
            icon: <CiCalendar size={20} />,
            slug: '/admin/appointments',
        },
        {
            name: 'Services',
            icon: <LuScissors />,
            slug: '/admin/services',
        },
        {
            name: 'Coupons',
            icon: <RiCoupon2Line size={20} />,
            slug: '/admin/coupons',
        },
        {
            name: 'Staffs',
            icon: <RxPeople size={20} />,
            slug: '/admin/staffs',
        },
        {
            name: 'Customers',
            icon: <GoDatabase size={20} />,
            slug: '/admin/customers',
        },
    ];

    return (
        <div>
            <ul className="list-none m-0 p-0">
                {menus.map((menu, index) => (
                    <li key={index}>
                        <Link href={menu.slug}>
                            <div
                                className={classNames([
                                    'flex items-center gap-2 px-5 h-14 border-solid border-l-[3px] transition-all duration-200',
                                    {
                                        'text-white/90 hover:bg-black/10 border-l-transparent':
                                            pathname !== menu.slug,
                                        'bg-primary/10 text-white border-l-primary':
                                            pathname === menu.slug,
                                        'flex items-center justify-center': !sidebarExpanded,
                                    },
                                ])}
                            >
                                <div className="shrink-0">{menu.icon}</div>
                                <span
                                    className={classNames({
                                        'block text-nowrap': sidebarExpanded,
                                        hidden: !sidebarExpanded,
                                    })}
                                >
                                    {menu.name}
                                </span>
                            </div>
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}
