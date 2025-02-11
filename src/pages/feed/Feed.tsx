import { useState } from "react";
import FeedList from "@modules/feed/components/FeedList";
import PostForm from "@modules/feed/components/PostForm";
import useCurrentUser from "@modules/feed/hooks/useCurrentUser";
import { createPost } from "@modules/feed/services/postService";
import "./Feed.css";

const Feed = () => {
    // TODO: Get current user ID from auth context
    const currentUserId = "copier1"; // Temporary hardcoded user
    const { user, loading, error } = useCurrentUser(currentUserId);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const handlePostSubmit = async (content: {
        text: string;
        images: string[];
    }) => {
        try {
            await createPost({
                userId: currentUserId,
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

    if (error || !user) {
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
                    <PostForm currentUser={user} onSubmit={handlePostSubmit} />
                    <FeedList
                        currentUserId={currentUserId}
                        key={isRefreshing ? "refreshing" : "normal"}
                    />
                </main>
            </div>
        </div>
    );
};

export default Feed;
