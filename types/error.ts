export interface CustomError extends Error {
    statusCode?: number;
    status?: string;
    parent?: string,
    sql?: string,
    errors: { message: string, path: string }[],
    path?: string,
}