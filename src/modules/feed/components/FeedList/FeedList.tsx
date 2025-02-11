import { useState, useEffect } from "react";
import type Post from "@/types/post.types";
import type User from "@/types/user.types";
import FeedItem from "./components/FeedItem";
import "./FeedList.css";

interface FeedListProps {
    currentUserId: string;
}

const FeedList = ({ currentUserId }: FeedListProps) => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [users, setUsers] = useState<{ [key: string]: User }>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch posts and users in parallel
                const [postsResponse, usersResponse] = await Promise.all([
                    fetch("http://localhost:3001/posts"),
                    fetch("http://localhost:3001/users"),
                ]);

                if (!postsResponse.ok || !usersResponse.ok) {
                    throw new Error("Failed to fetch data");
                }

                const postsData: Post[] = await postsResponse.json();
                const usersData: User[] = await usersResponse.json();

                // Create a map of users for quick lookup
                const usersMap = usersData.reduce((acc, user) => {
                    acc[user.id] = user;
                    return acc;
                }, {} as { [key: string]: User });

                setPosts(postsData);
                setUsers(usersMap);
            } catch (err) {
                setError(
                    err instanceof Error ? err.message : "An error occurred"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <div className="feed-list__loading">Loading posts...</div>;
    }

    if (error) {
        return <div className="feed-list__error">{error}</div>;
    }

    return (
        <div className="feed-list">
            {posts.map((post) => (
                <FeedItem
                    key={post.id}
                    post={post}
                    user={users[post.userId]}
                    currentUserId={currentUserId}
                />
            ))}
        </div>
    );
};

export default FeedList;
