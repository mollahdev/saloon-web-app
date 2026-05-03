export type ApiResponse<T> = {
    message: string;
    data: T;
};

export interface KnownError {
    message: string;
    description: string;
    code: number | undefined;
}
