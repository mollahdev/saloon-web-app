export const projectData = {
    title: 'Big Apple Barbers',
} as const;

export const passwordSaltRounds = 10;

const { DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME } = process.env;
export const dbUrl = `mysql://${DB_USER}:${encodeURIComponent(DB_PASSWORD ?? '')}@${DB_HOST}:${DB_PORT}/${DB_NAME}`;
