export interface ErrorType extends Error {
    statusCode?: number,
    code?: string,
}
