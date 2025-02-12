import { useState } from "react";
import FeedList from "@modules/feed/components/FeedList";
import PostForm from "@modules/feed/components/PostForm";
import useCurrentUser from "@modules/feed/hooks/useCurrentUser";
import { createPost } from "@modules/feed/services/postService";
import { useAuth } from "@/context/AuthContext";
import "./Feed.css";

const Feed = () => {
    const { user, loading: authLoading } = useAuth();
    const { user: userDetails, loading, error } = useCurrentUser(user?.id || '');

    if (authLoading) {
        return (
            <div className="feed-page">
                <div className="feed-page__container">
                    <div className="feed-page__loading">Loading...</div>
                </div>
            </div>
        );
    }
    const [isRefreshing, setIsRefreshing] = useState(false);

    const handlePostSubmit = async (content: {
        text: string;
        images: string[];
    }) => {
        try {
            if (!user?.id) return;
            await createPost({
                userId: user.id,
                content,
            });
            setIsRefreshing(true);
        } catch (error) {
            console.error("Failed to create post:", error);
            // TODO: Show error message to user
        } finally {
            setIsRefreshing(false);
        }
    };

    if (loading) {
        return (
            <div className="feed-page">
                <div className="feed-page__container">
                    <div className="feed-page__loading">Loading feed...</div>
                </div>
            </div>
        );
    }

    if (error || !user || !userDetails) {
        return (
            <div className="feed-page">
                <div className="feed-page__container">
                    <div className="feed-page__error">
                        {error?.message ||
                            "Error loading feed. Please try again later."}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="feed-page">
            <div className="feed-page__container">
                <header className="feed-page__header">
                    <h1 className="feed-page__title">Social Trading Feed</h1>
                </header>
                <main>
                    <PostForm currentUser={userDetails!} onSubmit={handlePostSubmit} />
                    <FeedList
                        currentUserId={user.id}
                        key={isRefreshing ? "refreshing" : "normal"}
                    />
                </main>
            </div>
        </div>
    );
};

export default Feed;
