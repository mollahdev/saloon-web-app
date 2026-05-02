import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const secret = new TextEncoder().encode(process.env.JWT_SECRET);
const algorithm = 'HS256';

export async function generatePermanentToken(payload: any) {
    const token = await new SignJWT(payload)
        .setProtectedHeader({ alg: algorithm })
        .setIssuedAt()
        // .setExpirationTime() is removed
        .sign(secret);

    return token;
}

export async function decrypt(token: string) {
    try {
        const { payload } = await jwtVerify(token, secret, {
            algorithms: [algorithm],
        });
        return payload;
    } catch {
        return null;
    }
}

export async function getSession() {
    const cookieStore = await cookies();
    const token = cookieStore.get('access_token')?.value;

    if (!token) return null;

    try {
        const payload = await decrypt(token);
        return payload;
    } catch {
        return null;
    }
}

export async function clearSession() {
    const cookieStore = await cookies();
    cookieStore.delete('access_token');
}

import { NextResponse } from 'next/server';

export function withAuth(
    handler: (req: Request, context: any, session: any) => Promise<Response> | Response
) {
    return async (request: Request, context: any) => {
        const authHeader = request.headers.get('authorization');

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const token = authHeader.split(' ')[1];
        const session = await decrypt(token);

        if (!session || !session.userId) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        return handler(request, context, session);
    };
}
