import { NextResponse } from 'next/server';
import { db } from '@/app/lib/db';

// GET Request: ডাটা পড়ার জন্য
export async function GET() {
    const users = await db.user.findMany();
    return NextResponse.json(users);
}

// POST Request: নতুন ডাটা তৈরি করার জন্য
// export async function POST(request: Request) {
//   const body = await request.json();
//   const newUser = await db.user.create({
//       data: {
//         name: body.name,
//         email: body.email,
//         role: body.role,
//         phone: body.phone,
//         password: body.password,
//     },
//   });
//   return NextResponse.json(newUser, { status: 201 });
// }
