export const projectData = {
    title: 'Big Apple Barbers',
} as const;

export const passwordSaltRounds = 10;

export const dbUrl = `mysql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}?allowPublicKeyRetrieval=true`;
