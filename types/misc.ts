export interface JwtPayload {
    roles?: string[];
    [key: string]: any;
}