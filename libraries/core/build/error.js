"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RateLimitError = void 0;
exports.getExceptionMessage = getExceptionMessage;
exports.throwError = throwError;
/**
 * Get an error string from an exception.
 */
function getExceptionMessage(error, noStackTrace = false) {
    var _a;
    if (error instanceof Error) {
        return noStackTrace ? error.message : ((_a = error.stack) !== null && _a !== void 0 ? _a : error.message);
    }
    else if (typeof error === 'object') {
        if (error && 'message' in error && 'details' in error && 'hint' in error && 'code' in error) {
            return `${error.message} - ${error.details}`;
        }
        return JSON.stringify(error);
    }
    else if (typeof error === 'string') {
        return error;
    }
    return `${error}`;
}
/**
 * Helper method used to throw an error.
 * Useful in situations where you want to assign a value or throw an error inline.
 *
 * e.g. const foo = obj.foo ?? throwError('obj.foo is undefined');
 */
function throwError(message) {
    throw new Error(message);
}
class RateLimitError extends Error {
    constructor(message) {
        super(message);
        this.name = 'RateLimitError';
    }
}
exports.RateLimitError = RateLimitError;
//# sourceMappingURL=error.js.map