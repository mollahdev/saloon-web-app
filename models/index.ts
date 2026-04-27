export type ApiResponse<T> = Promise<{
    message: string;
    data: T;
}>;

export interface KnownError {
    message: string;
    description: string;
    code: number | undefined;
}
