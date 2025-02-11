import type Post from "@/types/post.types";
import "./PostEngagement.css";

interface PostEngagementProps {
    engagement: Post["engagement"];
    currentUserId: string;
    onLike: () => void;
    onComment: () => void;
    onShare: () => void;
}

const PostEngagement = ({
    engagement,
    currentUserId,
    onLike,
    onComment,
    onShare,
}: PostEngagementProps) => {
    const { likes, comments, shares } = engagement;
    const isLiked = likes.includes(currentUserId);

    return (
        <div className="post-engagement">
            <div className="post-engagement__stats">
                <span className="post-engagement__stat">
                    {likes.length} likes
                </span>
                <span className="post-engagement__stat">
                    {comments.length} comments
                </span>
                <span className="post-engagement__stat">{shares} shares</span>
            </div>

            <div className="post-engagement__actions">
                <button
                    className={`post-engagement__button ${
                        isLiked ? "post-engagement__button--liked" : ""
                    }`}
                    onClick={onLike}
                >
                    {isLiked ? "Liked" : "Like"}
                </button>
                <button className="post-engagement__button" onClick={onComment}>
                    Comment
                </button>
                <button className="post-engagement__button" onClick={onShare}>
                    Share
                </button>
            </div>
        </div>
    );
};

export default PostEngagement;
