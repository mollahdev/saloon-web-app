import { db } from '@/app/lib/db';

export const dynamic = 'force-dynamic';

export default async function Home() {
    const users = await db.user.findMany();

    console.log(users);

    return <h1>Hello World</h1>;
}
