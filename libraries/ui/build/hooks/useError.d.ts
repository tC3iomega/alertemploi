/**
 * Hook used to handle errors.
 */
export declare function useError(): {
    error: unknown;
    handleError: ({ error, title, silent, }: {
        error: unknown;
        title?: string;
        silent?: boolean;
    }) => void;
    resetError: () => void;
};
//# sourceMappingURL=useError.d.ts.map