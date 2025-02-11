import { useState } from "react";
import type Post from "@/types/post.types";
import type User from "@/types/user.types";
import PostHeader from "./components/PostHeader";
import PostContent from "./components/PostContent";
import PostEngagement from "./components/PostEngagement";
import "./FeedItem.css";

interface FeedItemProps {
    post: Post;
    user: User;
    currentUserId: string;
}

const FeedItem = ({ post, user, currentUserId }: FeedItemProps) => {
    const [engagement, setEngagement] = useState(post.engagement);

    const handleLike = () => {
        const isLiked = engagement.likes.includes(currentUserId);
        const newLikes = isLiked
            ? engagement.likes.filter((id) => id !== currentUserId)
            : [...engagement.likes, currentUserId];

        setEngagement({
            ...engagement,
            likes: newLikes,
        });
    };

    const handleComment = () => {
        // TODO: Implement comment functionality
        console.log("Comment clicked");
    };

    const handleShare = () => {
        setEngagement({
            ...engagement,
            shares: engagement.shares + 1,
        });
    };

    return (
        <article className="feed-item">
            <PostHeader user={user} timestamp={post.createdAt} />
            <PostContent content={post.content} />
            <PostEngagement
                engagement={engagement}
                currentUserId={currentUserId}
                onLike={handleLike}
                onComment={handleComment}
                onShare={handleShare}
            />
        </article>
    );
};

export default FeedItem;
