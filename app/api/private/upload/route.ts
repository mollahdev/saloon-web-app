import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/db';
import { isActiveStatus } from '@/app/lib/permissions';
import { uploadImage } from '@/app/lib/cloudflare';
import crypto from 'crypto';

export async function POST(request: Request) {
    try {
        const userId = request.headers.get('x-user-id');

        if (!userId) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user || !isActiveStatus(user)) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
        }

        const formData = await request.formData();
        const file = formData.get('file') as File | null;

        if (!file) {
            return NextResponse.json({ message: 'No file uploaded' }, { status: 400 });
        }

        // Validate MIME type
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
        if (!allowedTypes.includes(file.type)) {
            return NextResponse.json(
                { message: 'Invalid file type. Only JPEG, PNG, WEBP, and GIF are allowed.' },
                { status: 400 }
            );
        }

        // Validate file size (5MB limit)
        const maxSizeBytes = 5 * 1024 * 1024;
        if (file.size > maxSizeBytes) {
            return NextResponse.json(
                { message: 'File size exceeds the 5MB limit.' },
                { status: 400 }
            );
        }

        // Convert File to Buffer
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Sanitize the filename to prevent path traversal and clean up spaces
        const sanitizedOriginalName = file.name
            .replace(/[^a-zA-Z0-9.-]/g, '_')
            .replace(/_{2,}/g, '_');

        // Generate a unique storage key
        const uniqueId = crypto.randomUUID();
        const key = `uploads/${uniqueId}-${sanitizedOriginalName}`;

        // Upload to Cloudflare R2
        const imageUrl = await uploadImage(buffer, key, file.type);

        return NextResponse.json({
            message: 'Image uploaded successfully',
            data: {
                url: imageUrl,
                key: key,
            },
        });
    } catch (error: any) {
        console.error('Image upload error:', error);
        return NextResponse.json(
            { message: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}
