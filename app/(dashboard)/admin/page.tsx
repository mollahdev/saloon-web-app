'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useAppDispatch } from '@/app/lib/store';
import { logoutAction } from '@/app/lib/store/auth-slice/auth-action';

export default function Admin() {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const dispatch = useAppDispatch();

    const handleLogout = () => {
        setIsLoading(true);
        dispatch(logoutAction())
            .unwrap()
            .then(() => {
                setIsLoading(false);
                router.push('/auth/login');
            })
            .catch(() => {
                setIsLoading(false);
            });
    };

    return (
        <div>
            <button
                onClick={handleLogout}
                disabled={isLoading}
                className="bg-black text-white px-5 py-2 cursor-pointer"
            >
                {isLoading ? 'Loading...' : 'Logout'}
            </button>
            <h1>Admin Panel</h1>
        </div>
    );
}
