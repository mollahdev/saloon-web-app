import 'dotenv/config';
import { defineConfig } from 'prisma/config';

const dbUrl = `mysql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;

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
