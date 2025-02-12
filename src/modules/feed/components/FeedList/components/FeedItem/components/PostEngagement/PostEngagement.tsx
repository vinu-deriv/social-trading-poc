import type Post from "@/types/post.types";
import CommentSection from "./components/CommentSection/CommentSection";
import "./PostEngagement.css";

interface PostEngagementProps {
    postId: string;
    engagement: Post["engagement"];
    currentUserId: string;
    onLike: () => void;
    onComment: (content: string) => void;
    onShare: () => void;
    onLikeComment?: (commentId: string) => void;
    onReplyToComment: (commentId: string, content: string) => void;
}

const PostEngagement = ({
    engagement,
    currentUserId,
    onLike,
    onComment,
    onShare,
    onLikeComment,
    onReplyToComment,
}: PostEngagementProps) => {
    const { likes, comments, shares } = engagement;
    const isLiked = likes.includes(currentUserId);

    return (
        <div className="post-engagement">
            <div className="post-engagement__stats">
                <span className="post-engagement__stat">
                    {likes.length} likes
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
                <button className="post-engagement__button" onClick={onShare}>
                    Share
                </button>
            </div>

            <CommentSection
                comments={comments}
                currentUserId={currentUserId}
                onAddComment={onComment}
                onLikeComment={onLikeComment}
                onReplyToComment={onReplyToComment}
            />
        </div>
    );
};

export default PostEngagement;
