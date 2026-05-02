import 'dotenv/config';
import { defineConfig } from 'prisma/config';
import { dbUrl } from './constants/db';

export default defineConfig({
    schema: 'prisma/schema',
    migrations: {
        path: 'prisma/migrations',
    },
    datasource: {
        url: dbUrl,
    },
});
