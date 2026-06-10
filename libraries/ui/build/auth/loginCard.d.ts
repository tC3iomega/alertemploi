export interface LoginCardProps {
    onLoginWithEmail: (params: {
        email: string;
        password: string;
    }) => void;
    isSubmitting: boolean;
    /** Render a link/button for "Sign up". If omitted, the sign-up prompt is hidden. */
    signUpLink?: React.ReactNode;
    /** Render a link/button for "Forgot password". If omitted, the link is hidden. */
    forgotPasswordLink?: React.ReactNode;
}
export declare function LoginCard({ onLoginWithEmail, isSubmitting, signUpLink, forgotPasswordLink, }: LoginCardProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=loginCard.d.ts.map