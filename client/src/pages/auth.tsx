import { SignIn } from "@clerk/clerk-react";

export default function AuthPage() {
    return (
        <div className="pt-24 min-h-screen bg-background flex items-center justify-center">
            <div className="max-w-md w-full p-4">
                <SignIn routing="path" path="/auth" signUpUrl="/auth" />
            </div>
        </div>
    );
}
