import { useState, useEffect } from "react";
import type User from "@/types/user.types";

const useCurrentUser = (userId: string) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await fetch(
                    `${import.meta.env.VITE_JSON_SERVER_URL}/users/${userId}`
                );
                if (!response.ok) {
                    throw new Error("Failed to fetch user");
                }
                const data = await response.json();
                setUser(data);
            } catch (err) {
                setError(
                    err instanceof Error ? err : new Error("Unknown error")
                );
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [userId]);

    return { user, loading, error };
};

export default useCurrentUser;
