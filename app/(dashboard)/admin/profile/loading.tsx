'use client';
import { Skeleton, Divider } from '@mantine/core';

export default function ProfileLoading() {
    return (
        <>
            <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg border border-gray-100">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-4">
                    {[...Array(4)].map((_, i) => (
                        <div key={i}>
                            <Skeleton height={14} width="30%" mb={8} />
                            <Skeleton height={42} radius="sm" />
                        </div>
                    ))}
                    <div className="col-span-1 md:col-span-2">
                        <Skeleton height={14} width="15%" mb={8} />
                        <Skeleton height={120} radius="sm" />
                    </div>
                </div>
                <Divider my="xl" />
                <div className="flex justify-end">
                    <Skeleton height={42} width={120} radius="sm" />
                </div>
            </div>
        </>
    );
}
