import 'dotenv/config';
import { defineConfig } from 'prisma/config';
import { dbUrl } from './constants';

export default defineConfig({
    schema: 'prisma/schema',
    migrations: {
        path: 'prisma/migrations',
        seed: 'npx tsx ./prisma/seed/default-owner-user.ts',
    },
    datasource: {
        url: dbUrl,
    },
});
