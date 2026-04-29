import Link from 'next/link';
import { IoHomeOutline } from 'react-icons/io5';
import { Button } from '@mantine/core';

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center h-full w-full relative overflow-hidden">
            <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-2xl">
                <div className="relative mb-4 group">
                    <h1 className="text-8xl md:text-9xl lg:text-[140px] font-black leading-none tracking-tighter text-transparent bg-clip-text bg-linear-to-br from-primary via-blue-500 to-indigo-600 group-hover:scale-105 transition-transform duration-500">
                        404
                    </h1>
                </div>

                <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-gray-800 mb-4 tracking-tight">
                    Page Not Found
                </h2>

                <p className="text-gray-500 mb-4 text-sm md:text-base lg:text-lg leading-relaxed max-w-lg">
                    Oops! The page you are looking for doesn&apos;t exist or has been moved.
                    Let&apos;s get you back to your dashboard.
                </p>

                <Link href="/admin">
                    <Button size="md" radius="md" leftSection={<IoHomeOutline size={20} />}>
                        Return to Dashboard
                    </Button>
                </Link>
            </div>
        </div>
    );
}
