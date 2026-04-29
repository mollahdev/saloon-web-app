import { notFound } from 'next/navigation';

export default function CatchAll() {
    notFound(); // This manually triggers your admin/not-found.tsx
}
