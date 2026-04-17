import { RedirectToSignIn, SignedIn, SignedOut, useAuth } from "@clerk/clerk-react";
import { Route, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { User } from "@shared/schema";
import { useEffect, useState } from "react";

export function ProtectedRoute({
    component: Component,
    path,
    adminOnly = false,
}: {
    component: React.ComponentType<any>;
    path: string;
    adminOnly?: boolean;
}) {
    const [, setLocation] = useLocation();
    const { getToken, isSignedIn } = useAuth();
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        if (adminOnly && isSignedIn) {
            getToken().then(setToken);
        }
    }, [adminOnly, isSignedIn, getToken]);

    const { data: user, isLoading, error } = useQuery<User>({
        queryKey: ["/api/user/me", token],
        enabled: adminOnly && token !== null,
        retry: false,
    });

    return (
        <Route path={path}>
            <SignedIn>
                {adminOnly ? (
                    isLoading || (isSignedIn && token === null) ? (
                        <div className="flex items-center justify-center min-h-screen">
                            <Loader2 className="w-8 h-8 animate-spin text-primary" />
                        </div>
                    ) : error || (user && !user.isAdmin) ? (
                        <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
                            <h1 className="text-2xl font-bold text-destructive mb-2">Access Denied</h1>
                            <p className="text-muted-foreground mb-4">You do not have permission to view this page.</p>
                            <button
                                onClick={() => setLocation("/")}
                                className="text-primary hover:underline"
                            >
                                Return to Home
                            </button>
                        </div>
                    ) : (
                        <Component />
                    )
                ) : (
                    <Component />
                )}
            </SignedIn>
            <SignedOut>
                <RedirectToSignIn />
            </SignedOut>
        </Route>
    );
}
