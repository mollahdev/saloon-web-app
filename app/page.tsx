import { prisma } from '@/app/lib/db';

export const dynamic = 'force-dynamic';

export default async function Home() {
    const users = await prisma.user.findMany();

    console.log(users);

    return (
        <div>
            <h1>Home Page</h1>
            {/* <pre>{JSON.stringify(users, null, 2)}</pre> */}
        </div>
    );
}
