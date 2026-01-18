import { createContext, ReactNode, useContext } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { User, InsertUser } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

type AuthContextType = {
    user: User | null;
    isLoading: boolean;
    error: Error | null;
    loginMutation: ReturnType<typeof useLoginMutation>;
    logoutMutation: ReturnType<typeof useLogoutMutation>;
    registerMutation: ReturnType<typeof useRegisterMutation>;
};

export const AuthContext = createContext<AuthContextType | null>(null);

function useLoginMutation() {
    const { toast } = useToast();
    return useMutation({
        mutationFn: async (credentials: Pick<InsertUser, "username" | "password">) => {
            const res = await apiRequest("POST", "/api/login", credentials);
            return await res.json();
        },
        onSuccess: (user: User) => {
            queryClient.setQueryData(["/api/user"], user);
            toast({
                title: "Welcome back!",
                description: `Logged in as ${user.username}`,
            });
        },
        onError: (error: Error) => {
            toast({
                title: "Login failed",
                description: error.message,
                variant: "destructive",
            });
        },
    });
}

function useRegisterMutation() {
    const { toast } = useToast();
    return useMutation({
        mutationFn: async (credentials: InsertUser) => {
            const res = await apiRequest("POST", "/api/register", credentials);
            return await res.json();
        },
        onSuccess: (user: User) => {
            queryClient.setQueryData(["/api/user"], user);
            toast({
                title: "Registration successful",
                description: `Welcome ${user.username}!`,
            });
        },
        onError: (error: Error) => {
            toast({
                title: "Registration failed",
                description: error.message,
                variant: "destructive",
            });
        },
    });
}

function useLogoutMutation() {
    const { toast } = useToast();
    return useMutation({
        mutationFn: async () => {
            await apiRequest("POST", "/api/logout");
        },
        onSuccess: () => {
            queryClient.setQueryData(["/api/user"], null);
            toast({
                title: "Logged out",
                description: "See you next time!",
            });
        },
        onError: (error: Error) => {
            toast({
                title: "Logout failed",
                description: error.message,
                variant: "destructive",
            });
        },
    });
}

export function AuthProvider({ children }: { children: ReactNode }) {
    const {
        data: user,
        isLoading,
        error,
    } = useQuery<User | null, Error>({
        queryKey: ["/api/user"],
        queryFn: async () => {
            try {
                const res = await apiRequest("GET", "/api/user");
                if (res.status === 401) return null;
                return await res.json();
            } catch (e) {
                return null; // Treat 401 or auth error as logged out
            }
        },
    });

    const loginMutation = useLoginMutation();
    const logoutMutation = useLogoutMutation();
    const registerMutation = useRegisterMutation();

    return (
        <AuthContext.Provider
            value={{
                user: user ?? null,
                isLoading,
                error,
                loginMutation,
                logoutMutation,
                registerMutation,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
