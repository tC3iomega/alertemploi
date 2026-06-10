/**
 * Get an error string from an exception.
 */
export declare function getExceptionMessage(error: unknown, noStackTrace?: boolean): string;
/**
 * Helper method used to throw an error.
 * Useful in situations where you want to assign a value or throw an error inline.
 *
 * e.g. const foo = obj.foo ?? throwError('obj.foo is undefined');
 */
export declare function throwError(message: string): never;
export declare class RateLimitError extends Error {
    constructor(message: string);
}
//# sourceMappingURL=error.d.ts.map