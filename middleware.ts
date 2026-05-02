import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { decrypt } from '@/app/lib/auth';

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Only apply to private API routes
    if (!pathname.startsWith('/api/private/')) {
        return NextResponse.next();
    }

    // For private API routes, validate the token
    const authHeader = request.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return NextResponse.json({ message: 'Unauthorized: No token provided' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const session = await decrypt(token);

    if (!session || !session.userId) {
        return NextResponse.json({ message: 'Unauthorized: Invalid token' }, { status: 401 });
    }

    // Add session data to headers so the API routes can access it
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-user-id', session.userId as string);

    return NextResponse.next({
        request: {
            headers: requestHeaders,
        },
    });
}

export const config = {
    matcher: [
        /*
         * Match all request paths for the API.
         */
        '/api/:path*',
    ],
};
